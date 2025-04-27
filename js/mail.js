// mail.js
function sendEmail(fromName, fromEmail, to, subject, message) {
   if (!fromName || !fromEmail || !to || !subject || !message) {
      console.error("All fields (fromName, fromEmail, to, subject, message) are required.");
      return;
   }

   const validSubjects = ["Üyelik", "Soru", "Maddi Yardım Yapma", "Diğer Konular"];
   if (!validSubjects.includes(subject)) {
      console.error(`Invalid subject. Valid subjects are: ${validSubjects.join(", ")}`);
      return;
   }

   // Simulate sending an email
   console.log(`From: ${fromName} <${fromEmail}>`);
   console.log(`To: ${to}`);
   console.log(`Subject: ${subject}`);
   console.log(`Message: ${message}`);

   // Mock success response
   return {
      status: "success",
      message: "Email sent successfully!"
   };
}

// Example usage
const emailResponse = sendEmail(
   "John Doe",
   "john.doe@example.com",
   "example@example.com",
   "Üyelik",
   "This is a test email."
);
console.log(emailResponse);