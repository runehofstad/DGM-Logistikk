import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";

admin.initializeApp();

// Set SendGrid API key
const sendgridKey = functions.config().sendgrid?.key;
if (sendgridKey) {
  sgMail.setApiKey(sendgridKey);
}

// Send email notification when a new freight request is created
export const onNewFreightRequest = functions.firestore
    .document("requests/{requestId}")
    .onCreate(async (snap, context) => {
      const request = snap.data();
      const requestId = context.params.requestId;

      try {
        // Get company info
        const companyDoc = await admin.firestore()
            .doc(`companies/${request.companyId}`)
            .get();
        
        if (!companyDoc.exists) return;
        
        const company = companyDoc.data();

        // Find potential sellers (users with seller role)
        const sellersSnapshot = await admin.firestore()
            .collection("users")
            .where("role", "==", "seller")
            .get();

        const emailPromises = sellersSnapshot.docs.map(async (doc) => {
          const seller = doc.data();
          
          const msg = {
            to: seller.email,
            from: "noreply@dgm-logistikk.web.app",
            subject: "Ny fraktforespørsel tilgjengelig",
            html: `
              <h2>Ny fraktforespørsel</h2>
              <p>En ny fraktforespørsel er tilgjengelig på DGM Logistikk:</p>
              
              <div style="border: 1px solid #ddd; padding: 16px; margin: 16px 0;">
                <h3>${request.cargoType}</h3>
                <p><strong>Fra:</strong> ${request.pickupLocation}</p>
                <p><strong>Til:</strong> ${request.deliveryLocation}</p>
                <p><strong>Vekt:</strong> ${request.weight} kg</p>
                <p><strong>Antall kolli:</strong> ${request.numberOfItems}</p>
                ${request.specialNeeds ? `<p><strong>Spesielle behov:</strong> ${request.specialNeeds}</p>` : ''}
                <p><strong>Firma:</strong> ${company?.name}</p>
              </div>
              
              <p><a href="https://dgmlogistikk.no/foresporsler" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Se forespørsel</a></p>
            `,
          };

          if (sendgridKey) {
            return sgMail.send(msg);
          } else {
            console.log("SendGrid not configured, email would be sent:", msg);
            return Promise.resolve();
          }
        });

        await Promise.all(emailPromises);
        console.log(`Sent ${emailPromises.length} notification emails for request ${requestId}`);
      } catch (error) {
        console.error("Error sending notifications:", error);
      }
    });

// Send email notification when a company is approved
export const onCompanyApproved = functions.firestore
    .document("companies/{companyId}")
    .onUpdate(async (change, context) => {
      const before = change.before.data();
      const after = change.after.data();
      
      // Check if company was just approved
      if (!before.approved && after.approved) {
        try {
          // Get the user who created the company
          const userDoc = await admin.firestore()
              .doc(`users/${after.createdBy}`)
              .get();
          
          if (!userDoc.exists) return;
          
          const user = userDoc.data();

          const msg = {
            to: user?.email,
            from: "noreply@dgmlogistikk.no",
            subject: "Ditt firma er godkjent!",
            html: `
              <h2>Gratulerer!</h2>
              <p>Ditt firma <strong>${after.name}</strong> har blitt godkjent på DGM Logistikk.</p>
              <p>Du kan nå begynne å bruke alle funksjonene på plattformen.</p>
              
              <p><a href="https://dgmlogistikk.no" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Gå til plattformen</a></p>
            `,
          };

          if (sendgridKey) {
            await sgMail.send(msg);
          } else {
            console.log("SendGrid not configured, email would be sent:", msg);
          }
          
          console.log(`Sent approval notification to ${user?.email}`);
        } catch (error) {
          console.error("Error sending approval notification:", error);
        }
      }
    });

// Weekly statistics email for superadmins
export const weeklyStats = functions.pubsub
    .schedule("0 9 * * 1") // Every Monday at 9 AM
    .timeZone("Europe/Oslo")
    .onRun(async (context) => {
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Get statistics
        const [requestsSnapshot, companiesSnapshot, usersSnapshot] = await Promise.all([
          admin.firestore().collection("requests")
              .where("createdAt", ">=", oneWeekAgo)
              .get(),
          admin.firestore().collection("companies")
              .where("createdAt", ">=", oneWeekAgo)
              .get(),
          admin.firestore().collection("users")
              .where("createdAt", ">=", oneWeekAgo)
              .get(),
        ]);

        // Get superadmins
        const superadminsSnapshot = await admin.firestore()
            .collection("users")
            .where("role", "==", "superadmin")
            .get();

        if (superadminsSnapshot.empty) return;

        const stats = {
          newRequests: requestsSnapshot.size,
          newCompanies: companiesSnapshot.size,
          newUsers: usersSnapshot.size,
        };

        const emailPromises = superadminsSnapshot.docs.map(async (doc) => {
          const admin = doc.data();
          
          const msg = {
            to: admin.email,
            from: "noreply@dgmlogistikk.no",
            subject: "Ukentlig statistikk - DGM Logistikk",
            html: `
              <h2>Ukentlig statistikk</h2>
              <p>Her er en oversikt over aktiviteten den siste uken:</p>
              
              <ul>
                <li><strong>Nye forespørsler:</strong> ${stats.newRequests}</li>
                <li><strong>Nye firmaer:</strong> ${stats.newCompanies}</li>
                <li><strong>Nye brukere:</strong> ${stats.newUsers}</li>
              </ul>
              
              <p><a href="https://dgmlogistikk.no/admin" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Gå til admin panel</a></p>
            `,
          };

          if (sendgridKey) {
            return sgMail.send(msg);
          } else {
            console.log("SendGrid not configured, email would be sent:", msg);
            return Promise.resolve();
          }
        });

        await Promise.all(emailPromises);
        console.log(`Sent weekly stats to ${emailPromises.length} superadmins`);
      } catch (error) {
        console.error("Error sending weekly stats:", error);
      }
    });