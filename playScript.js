let phishingMistakes = 0;
let correctReports = 0;
let falseReports = 0;
let safeTrusts = 0;


function confirmLeave(shouldLeave) {
  const modal = document.getElementById('leaveConfirmModal');
  modal.style.display = 'none';

  if (shouldLeave && pendingRedirectHref) {
    // Redirect now:
    window.location.href = pendingRedirectHref;
    pendingRedirectHref = null; // clear to avoid accidental reuse
  } else {
    pendingRedirectHref = null; // clear on cancel too
  }
}


// Optional: Dismiss modal on ESC or outside click
window.addEventListener('click', function (e) {
  const modal = document.getElementById('leaveConfirmModal');
  if (e.target === modal) {
    modal.style.display = 'none';
    pendingRedirectHref = null;
  }
});
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('leaveConfirmModal');
    modal.style.display = 'none';
    pendingRedirectHref = null;
  }
});


document.addEventListener('DOMContentLoaded', function () {

  let handledCount = 0;
  let failedGuesses = 0;
  let score = 0;
  const scoreText = document.getElementById('score-text');
  const reportBtn = document.getElementById('reportBtn');
  const trustBtn = document.getElementById('trustBtn');
  
  
  

  function updateScore(points) {
    score += points;
    scoreText.textContent = `Score: ${score}`;
  }
// changed name logic - start
  let userName = localStorage.getItem('userName');

if (!userName || userName.trim() === '') {
  alert("No user name found! Please go back and enter your name.");
  window.location.href = 'instruction.html'; // or wherever your form is
  return;
}
// changed name logic - finish
// Names are text even inside the formatted, trusted email templates.
const safeUserName = userName.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));


 /*if (randomEmails.length > 0) {
 selectedIndex = 0;
 const firstEmail = randomEmails[0];
 emailHeader.innerHTML = `<strong>From:</strong> ${firstEmail.from.name}<br>${firstEmail.from.email}<br><strong>Subject:</strong> ${firstEmail.subject}`;
 emailBody.innerHTML = firstEmail.body.replace('{name}', () => safeUserName);
 highlightSelected(selectedIndex);
 reportBtn.disabled = false;
 trustBtn.disabled = false;
}*/
 
const emails = [
// 📌 PHISHING EMAILS
  {
    from: {name:"IT-Announcements",
    email:"it@superdeevs.invalid"},
    subject: "Urgent: Password Expiry",
    body: `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
Your password expires in 12 hrs.<br>
<a href="https://training-link.invalid" onclick="event.preventDefault()">Reset Password</a><br><br>
Thank you.<br>`,
    isPhishing: true,
    question: "What makes this email suspicious?",
    options: [
      "link is fake.",
    "Email address has a typo.",
    "Sent during work hours.",
    "Offers a reward."
    ],
    correctAnswers: [
      "link is fake.",
      "Email address has a typo."
    ]
  },
  {
    from: {name:"Steve Roberts",
    email:"xyza$7@gmail.com"},
    subject: "Quick Favor Needed",
    body: `  <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
Can you purchase 5 gift cards for clients? <br>Send pics.`,
    isPhishing: true,
    question: "Why is this email considered phishing?",
    options: [
      "Personal and urgent request.",
    "Sender’s email is informal.",
    "Has legal disclaimers.",
    "Tone is calm."
    ],
    correctAnswers: [
    "Personal and urgent request.",
    "Sender’s email is informal."
    ]
  },
  {
    from: {name:"teams",
     email:"noreply@teans.mail.microsofft"},
    subject: "Account Suspicious Activity",
    body: `
  <div style="font-family: Segoe UI, sans-serif; background-color: #f3f2f1; padding: 16px; border-radius: 6px; border: 1px solid #ccc;">
    <h3 style="margin-top: 0; color: #242424;">⚠️ Unusual Sign-in Activity</h3>
    <p>Hello,</p>
    <p>We've detected suspicious activity in your Microsoft Teams account. For your protection, we recommend verifying your recent sign-in.</p>
    <div style="background-color: #fff; padding: 12px; border: 1px solid #ddd; margin: 10px 0;">
      <p><strong>Location:</strong> Russia</p>
      <p><strong>Time:</strong> 30 July 2025 - 01:37 AM</p>
      <p><strong>Device:</strong> Windows - Chrome Browser</p>
    </div>
    <a href="https://training-link.invalid"
       onclick="event.preventDefault();"
       style="display: inline-block; background-color: #6264a7; color: white; padding: 10px 16px; text-decoration: none; border-radius: 4px;">
       Login to Microsoft Teams
    </a>
    <p style="margin-top: 16px; font-size: 12px; color: #666;">If this wasn't you, please secure your account immediately.</p>
  </div>
`,
    isPhishing: true,
    question: "What are the red flags in this email?",
    options: [
    "Misspelled domain.",
    "Suspicious login link.",
    "Has a calendar invite.",
    "Includes an attachment."
    ],
    correctAnswers: [
    "Misspelled domain.",
    "Suspicious login link."
    ]
  },
  {
    from: {name:"Prize4you",
     email:"rewards@superdevs-prizes.invalid"},
    subject: "🎉 Congrats! You’ve Won a New iPhone 9s",
    body: `
  <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #1367c1;">🎉 Congratulations, ${safeUserName || 'Valued Employee'}!</h2>
 
    <p>You’ve been <strong>randomly selected</strong> from the <em>SuperDevs employee database</em> to receive a brand new <strong>iPhone 9s</strong> as part of our <u>Employee Appreciation Month</u> campaign.</p>
 
    <div style="background-color: white; padding: 14px; margin: 20px 0; border: 1px dashed #ccc;">
      <p><strong>Prize:</strong> Apple iPhone 9s (128GB, Midnight Black)</p>
      <p><strong>Status:</strong> ✅ Reserved for: ${safeUserName || 'Your Account'}</p>
      <p><strong>Action Required:</strong> Confirm your shipping details</p>
    </div>
 
    <a href="https://training-link.invalid"
       onclick="event.preventDefault();"
       style="display: inline-block; background-color: #e5f5ff; color: black; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">
      🎁 Claim My iPhone 9s
    </a>
 
    <p style="color: #c62828; margin-top: 12px;"><strong>Hurry!</strong> Only <strong>5 devices</strong> left. Offer expires in <u>3 hours</u>.</p>
  </div>`,
    isPhishing: true,
    question: "Why is this email a phishing attempt?",
    options: [
    "No such iPhone exists.",
    "Email not linked to company.",
    "Contains grammar mistakes.",
    "Mentions company event."
    ],
    correctAnswers: [
    "No such iPhone exists.",
    "Email not linked to company."
    ]
  },
  {
    from: {name:`Finance-Announcements`,
      email:`finance@superdevs.invalid`},
    subject: "Invoice Payment Required",
    body:  `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
 
  <div class="fake-attachment" >
    <img src="assets/images/file-icon.png" alt="File Icon" class="file-icon" />
    <span>invoice398213.pdf</span>
  </div>
  <br>
   dear {name},<br><br>
  Unpaid invoice. Please see the attached document below.<br><br>
  `,
    isPhishing: true,
    question: "What makes this email dangerous?",
    options: [
    "Link may contain malware.",
    "Email address is misspelled.",
    "Vague subject.",
    "Uses secure server."
    ],
    correctAnswers: [
    "Link may contain malware.",
    "Email address is misspelled."
    ]
  },
  {
    from: {name:"IT-Announcements",
    email:"IT-Announcement@superd3vs.invalid"},
    subject: "iCloud Locked",
    body: `  <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
dear {name},<br><br>Your iCloud has been locked due to login from Russia.<br>
    <a href="https://training-link.invalid" onclick="event.preventDefault()">click</a> on the link for more details.`,
    isPhishing: true,
    question: "How can you tell this is phishing?",
    options: [
    "suspicious email domain.",
    "iCloud is not updated",
    "link is fake.",
    "Has unsubscribe link."
    ],
    correctAnswers: [
    "suspicious email domain.",
    "link is fake."
    ]
  },
  {
    from: {name:"IT-Announcements",
    email:"IT-Announcement@superd3vs.invalid"},
    subject: "Verify Your Email",
    body: `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
we had sended a verification link on [{name}@superdevs.example]<br><br>
    click on the links to complete the verification process.<br><br>
    <a href="https://training-link.invalid" onclick="event.preventDefault()">verification links</a>`,
    isPhishing: true,
    question: "What are the signs of phishing here?",
    options: [
    "Bad grammar and unprofessional tone.",
    "Uses personal greeting.",
    "Includes policy terms.",
    "link is fake."
    ],
    correctAnswers: [
  "Bad grammar and unprofessional tone.",
    "link is fake."
    ]
  },
  {
    from: {name:"Information security-Announcements",
     email:"CS-Announcement@superdevs.example"},
    subject: "Mandatory Review: HIPAA Privacy Rule Updates",
    body: `  <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
 
     <div class="fake-attachment" >
    <img src="assets/images/file-icon.png" alt="File Icon" class="file-icon" />
    <span>HIPPA.pdf</span>
  </div>
    <br>Dear Team,<br><br>
Please access the compliance briefing document.<br><br>
Review Updated HIPAA Guidelines<br><br>
<p style="color: #c62828;">Failure to acknowledge by EOD Thursday may result in access limitations.</p>`,
    isPhishing: true,
    question: "Why is this suspicious?",
    options: [
    "HIPAA doesn’t apply to company.",
    "Threatens action.",
    "Link is verified.",
    "No attachments."
    ],
    correctAnswers: [
    "HIPAA doesn’t apply to company.",
    "Threatens action."
    ]
  },
   {
    from: {
  name: "SuperDevs Support",
  email: "support@superdevs.example"
},
    subject: "Request REQ0316774 was completed",
    body: `  <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
Hi {name},<br>
REQ0316664 has been marked complete.
Hopefully you have everything you need. <br>
Thanks for using our service! <br><br>
we kindly need your feedback on the link below!<br>
<a href="https://training-link.invalid" onclick="event.preventDefault()">Feedback-Form</a>`,
    isPhishing: true,
    question: "Why is this suspicious?",
    options: [
      "Request was not fulfilled.",
      "The language includes threats of action.",
      "mismatch of request numbers in the email",
      "There are no attachments."
    ],
    correctAnswers: [
       "mismatch of request numbers in the email"
    ]
  },
   {
    from: {name:"IT-Announcements",
    email:"IT-Announcement@superdev.invalid"},
    subject: "IT weekly meeting",
    body: `
  <div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <h3 style="margin-top: 0; color: #444;">Microsoft Teams Meeting</h3>
    <p><strong>Topic:</strong> Q3 Performance Review</p>
    <p><strong>Organizer:</strong> IT Department</p>
    <p><strong>Date:</strong> Wednesday, August 7, 2025</p>
    <p><strong>Time:</strong> 2:00 PM – 3:00 PM</p>
    <p><strong>Location:</strong> Microsoft Teams</p>
    <hr style="margin: 12px 0;">
    <a href="https://training-link.invalid"
       onclick="event.preventDefault();"
       style="display: inline-block; padding: 10px 18px; background-color: #6264a7; color: white; text-decoration: none; border-radius: 4px;">
      Join Microsoft Teams Meeting
    </a>
    <p style="font-size: 12px; color: #888; margin-top: 10px;">Trouble joining? Copy this link into your browser.</p>
   
  </div>
`,
    isPhishing: true,
    question: "Why is this suspicious?",
    options: [
    "Meeting is unnecessary.",
    "Threatens action.",
    "Email address typo.",
    "No attachments."
    ],
    correctAnswers: [
    "Email address typo."
    ]
  },
 
  // ✅ LEGITIMATE EMAILS
  {
    from: {name:"HR-Announcements",
    email:"hr-announcements@superdevs.example"},
    subject: "Upcoming Policy Review Session – Attendance Required",
    body: `      <div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
Hi {name},
We will be holding a mandatory HR policy review session next Monday at 10:00 AM in Meeting Room B. <br><br>Please make sure to attend as it includes key updates on remote work policies.<br>
Regards,`,
    isPhishing: false
  },
  {
    from: {name: "IT-Announcements",
    email:"IT-Announcements@superdevs.example"},
    subject: "Scheduled Maintenance – VPN Access Affected",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
Hi Team,<br>
Please note that the VPN service will be undergoing maintenance on Thursday from 11 PM to 3 AM. <br><r>Kindly save your work and log off before that time.<br>
Thanks`
,    isPhishing: false
  },
  {
    from: {name: "Cybersecurity-Announcements",
    email:"CS-Announcement@superdevs.example"},
    subject: "Reminder: Change Your Password Every 90 Days",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
  <p>Dear {name},<br><br>
This is a reminder that your SuperDevs OCM account password will expire in 5 days. <br><br>Please update it using the password portal to avoid disruptions.<br>
Best,</p>  `,
    isPhishing: false
  },
  {
    from: {name:"Alex Morgan",
    email:"alex.morgan@superdevs.example"},
    subject: "Re: Can You Cover Tomorrow’s Client Call?",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    Hey {name},<br><br>
I have a family emergency tomorrow morning. Can you please cover the client call with Example Client at 10 AM?<br> I’ll forward you the notes.<br><br>
Thanks a lot!`,
    isPhishing: false
  },
  {
    from: {name:"HR-Announcements" ,
    email:"hr-announcements@superdevs.example"},
    subject: "Upcoming Excel Workshop",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    Seats are still available for this Friday’s Excel skills session. Register via the intranet.`,
    isPhishing: false
  },
  {
    from: {name: "HR-Announcements",
    email:"hr-announcements@superdevs.example"},
    subject: "Eid Holiday Schedule Announced",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
   Dear Employees,<br><br>
We are pleased to announce the Eid holiday schedule. The break will start on Sunday, June 15th, and work will resume on Sunday, June 22nd.<br><br>
Enjoy your holiday and stay safe.<br><br>
Regards,<br>`,
    isPhishing: false
  },
 
    {
    from: {name:"IT-Announcements",
    email:"IT-Announcements@superdevs.example"},
    subject: "Laptop Replacement – Action Required",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
   Hi {name},<br><br>
You’re eligible for a device upgrade.<br> Please visit the IT desk (Room 3C) this week to collect your new laptop. <br>Bring your current device for trade-in.<br><br>
Thanks,`,
    isPhishing: false
  },  {
    from: {name:"Cybersecurity-Announcements",
    email:"CS-Announcement@superdevs.example"},
    subject: "[ACTION NEEDED] Complete Annual Security Awareness Training",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
Hi Team,<br><br>
Our annual security training is now live. <br>Please complete it before August 10th to stay compliant with company requirements.<br><br>
Regards,`,
    isPhishing: false
  },  {
    from:{name:"Taylor Reed",
    email:"taylor.reed@superdevs.example"} ,
    subject: "Lunch Meeting with the Vendor on Tuesday",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
  Hey {name},<br><br>
The vendor from Example Client confirmed lunch on Tuesday at 1:00 PM at the Downtown Café. Please bring the updated proposal for discussion.<br><br>
Thanks,<br>`,
    isPhishing: false
  },  {
    from:{name:"MICROSOFT TEAMS",
    email:"no-reply@teams.mail.microsoft"} ,
    subject: "Microsoft Teams Access Restored",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
   Hi {name},<br><br>
We’ve resolved the access issue you reported with Microsoft Teams.<br><br> Please try logging in again, and let us know if the problem persists.<br><br>
Regards,`,
    isPhishing: false
  },
  {
    from:{name:"Cybersecurity-Announcements",
    email:"CS-Announcement@superdevs.example"} ,
    subject: " Two-Factor Authentication Is Now Mandatory",
    body: `<div style="border: 1px solid #d2d2d2; padding: 16px; border-radius: 6px; font-family: Arial, sans-serif; background-color: #f9f9f9;">
   Dear All,<br><br>
Starting next Monday, 2FA will be required for all remote logins.<br> Please set up your authenticator app using the guide shared in the company portal.<br><br>
Regards,`,
    isPhishing: false
  }
];
 
 


// Pick 10 random emails
const randomEmails = shuffleEmails(emails).slice(0, 10);
const emailList = document.querySelector('.email-list');
const emailHeader = document.querySelector('.email-header');
const emailBody = document.querySelector('.email-body');

let selectedIndex = 0;
const emailBoxes = [];

emailList.innerHTML = '';


// the problem is here
randomEmails.forEach((email, index) => {
  email.phished = false;
  const div = document.createElement('button');
  div.type = 'button';
  div.className = 'email-box';
  const senderPreview = document.createElement('span');
  senderPreview.className = 'email-summary-from';
  senderPreview.textContent = `From: ${email.from.name}`;
  const subjectPreview = document.createElement('span');
  subjectPreview.className = 'email-summary-subject';
  subjectPreview.textContent = `Subject: ${email.subject}`;
  div.append(senderPreview, subjectPreview);
  div.title = `From: ${email.from.name}\nSubject: ${email.subject}`;
  div.setAttribute('aria-label', `From: ${email.from.name}. Subject: ${email.subject}`);
  div.style.cursor = 'pointer';
 
  div.addEventListener('click', () => {
    removeQuiz();
    selectedIndex = index;
    emailHeader.innerHTML = `<strong>From:</strong> ${email.from.name}<br>${email.from.email}<br><strong>Subject:</strong> ${email.subject}`;
    emailBody.innerHTML = email.body.replace('{name}', () => safeUserName);
    highlightSelected(index);
 
    // Disable buttons if already answered
    if (email.answered) {
      reportBtn.disabled = true;
      trustBtn.disabled = true;
 
      // Re-show quiz if phishing and not yet answered
      if (
        email.isPhishing &&
        email.question &&
        (email.correctAnswers || email.correctAnswer) &&
        !email.quizAnswered &&
        !email.phished
      ) {
        showQuiz(email);
      }
    } else {
      reportBtn.disabled = false;
      trustBtn.disabled = false;
    }
  });
 
  emailBoxes.push(div);
  emailList.appendChild(div);
 
  // Restore quiz if phishing and quiz exists and not completed
  if (
    email.isPhishing &&
    email.question &&
    (email.correctAnswers || email.correctAnswer) &&
    email.answered &&
    !email.quizAnswered &&
    !email.phished
    
  ) {
    showQuiz(email);
  }
});

 if (randomEmails.length > 0) {
 selectedIndex = 0;
 const firstEmail = randomEmails[0];
 emailHeader.innerHTML = `<strong>From:</strong> ${firstEmail.from.name}<br>${firstEmail.from.email}<br><strong>Subject:</strong> ${firstEmail.subject}`;
 emailBody.innerHTML = firstEmail.body.replace('{name}', () => safeUserName);
 highlightSelected(selectedIndex);
 reportBtn.disabled = false;
 trustBtn.disabled = false;
}

/* Default show first email
if (randomEmails.length > 0) {
  emailHeader.innerHTML = `<strong>From:</strong> ${randomEmails[0].from}<br><strong>Subject:</strong> ${randomEmails[0].subject}`;
  emailBody.innerHTML = randomEmails[0].body.replace('{name}', () => safeUserName); 
}*/

// Highlight selected email box
function highlightSelected(index) {
  emailBoxes.forEach((box, i) => {
    box.style.border = i === index ? '2px solid #3e8adb' : '1px solid #ccc';
  });

  // ✅ Auto-scroll the selected box into view
  emailBoxes[index].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}


//autoMails
function showNextEmail() {
  if (selectedIndex + 1 < randomEmails.length) {
    selectedIndex++;
    const nextEmail = randomEmails[selectedIndex];
    emailHeader.innerHTML = `<strong>From:</strong> ${nextEmail.from.name}<br>${nextEmail.from.email}<br><strong>Subject:</strong> ${nextEmail.subject}`;
    emailBody.innerHTML = nextEmail.body.replace('{name}', () => safeUserName);

    highlightSelected(selectedIndex);
    reportBtn.disabled = false;
    trustBtn.disabled = false;

    // ✅ SHOW QUIZ IF needed
    if (
      nextEmail.isPhishing &&
      nextEmail.question &&
      nextEmail.answered &&
      (nextEmail.correctAnswers || nextEmail.correctAnswer) &&
      !nextEmail.quizAnswered &&
      !nextEmail.phished
    ) {
      showQuiz(nextEmail);
    }

  } else {
    // Already at the last email
    const lastEmail = randomEmails[selectedIndex];
    emailHeader.innerHTML = `<strong>From:</strong> ${lastEmail.from.name}<br>${lastEmail.from.email}<br><strong>Subject:</strong> ${lastEmail.subject}`;
    emailBody.innerHTML = lastEmail.body.replace('{name}', () => safeUserName);

    reportBtn.disabled = true;
    trustBtn.disabled = true;
  }
}


//Quiez
function showQuiz(email) {
  removeQuiz();
  const quizContainer = document.createElement('div');
  quizContainer.className = 'quiz';

  quizContainer.setAttribute('id', 'quizBox');

  const questionElem = document.createElement('p');
  questionElem.textContent = email.question;
  quizContainer.appendChild(questionElem);

  const selectedAnswers = new Set();

  email.options.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = option;

    btn.addEventListener('click', () => {
      if (selectedAnswers.has(option)) {
        selectedAnswers.delete(option);
        btn.classList.remove('selected');
      } else {
        selectedAnswers.add(option);
        btn.classList.add('selected');
      }
    });

    quizContainer.appendChild(btn);
  });

  // Feedback area
  const feedback = document.createElement('div');
  feedback.className = 'quiz-feedback'; // Style this in CSS
  quizContainer.appendChild(feedback);

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit';
  submitBtn.className = 'submit-btn';
  submitBtn.style.marginTop = '15px';

  submitBtn.addEventListener('click', () => {
    const correct = Array.isArray(email.correctAnswers)
      ? email.correctAnswers
      : [email.correctAnswer];
    const selected = Array.from(selectedAnswers);

    const isCorrect =
      selected.length === correct.length &&
      selected.every(ans => correct.includes(ans)) &&
      correct.every(ans => selected.includes(ans));

 
    if (isCorrect) {
      email.quizAnswered = true;
      feedback.textContent = 'Correct! Great job!';
      feedback.classList.remove('error');
      feedback.classList.add('success');
 
      setTimeout(() => {
        removeQuiz();
        showNextEmail();
        checkGameEnd();
 
      }, 300);
      
    } else {
      feedback.textContent = 'Not quite. Try again!';
      feedback.classList.remove('success');
      feedback.classList.add('error');
 
      selectedAnswers.clear();
      const optionButtons = quizContainer.querySelectorAll('.quiz-option');
      optionButtons.forEach(btn => btn.classList.remove('selected'));
    }
  });

  quizContainer.appendChild(submitBtn);
  document.querySelector('.game-overlay').appendChild(quizContainer);
}

function removeQuiz() {
  const existingQuiz = document.getElementById('quizBox');
  if (existingQuiz) {
    existingQuiz.remove();
  }
}

function checkGameEnd() {
  const allHandled = handledCount >= randomEmails.length;

  // ✅ Check if all phishing quizzes were answered (if present)
  const allQuizzesCompleted = randomEmails.every(email => {
    if (email.isPhishing && email.question &&  !email.phished) {
      return email.quizAnswered === true;
    }
    return true;
  });

  if (allHandled && allQuizzesCompleted) {
    const modal = document.getElementById('endGameModal');
    const title = document.getElementById('endTitle');
    const message = document.getElementById('endMessage');

    if (phishingMistakes > 0) {
      title.textContent = 'You Got Phished!';
      title.className = 'feedback-error';
    } else {
      title.textContent = 'Great Job!';
      title.className = 'feedback-success';
    }

    const table = document.createElement('table');
    table.className = 'results-table';
    const caption = document.createElement('caption');
    caption.textContent = 'Your results';
    table.appendChild(caption);
    const results = [
      ['Emails reviewed', handledCount, ''],
      ['Phishing emails correctly reported', correctReports, 'feedback-success'],
      ['Safe emails correctly trusted', safeTrusts, 'feedback-success'],
      ['Phishing emails trusted', phishingMistakes, 'feedback-error'],
      ['Safe emails reported', falseReports, 'feedback-error'],
      ['Final score', `${score} / ${randomEmails.length * 10}`, 'result-total']
    ];
    const tbody = document.createElement('tbody');
    for (const [label, value, tone] of results) {
      const row = document.createElement('tr');
      row.className = tone;
      const heading = document.createElement('th');
      heading.scope = 'row';
      heading.textContent = label;
      const cell = document.createElement('td');
      cell.textContent = String(value);
      row.append(heading, cell);
      tbody.appendChild(row);
    }
    table.appendChild(tbody);
    message.replaceChildren(table);
    modal.style.display = 'flex';
    submitScore(userName, score);
  }
  
}


async function submitScore(name, score) {
  const status = document.getElementById('scoreSaveStatus');
  status.textContent = 'Saving score…';
  try {
    const response = await fetch('/.netlify/functions/scoreboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score })
    });
    if (!response.ok) throw new Error('Score submission failed');
    const result = await response.json();
    status.textContent = result.name && result.name !== name ? `Score saved as ${result.name} (your original name was taken).` : 'Score saved!';
  } catch {
    status.textContent = 'Your score could not be saved. The scoreboard may not be configured yet.';
  }
}

reportBtn.addEventListener('click', () => {
  const current = randomEmails[selectedIndex];
  const box = emailBoxes[selectedIndex];

  if (current.answered) return;
  current.answered = true;
  handledCount++;

  if (current.isPhishing) {
    box.style.backgroundColor = '#d4edda'; // green
    updateScore(10);
    correctReports++;

    if (current.question && (current.correctAnswers || current.correctAnswer)) {
      showQuiz(current); // Don't auto advance — wait for quiz
      checkGameEnd();
    } else {
      setTimeout(showNextEmail, 100);
    }
  } else {
    box.style.backgroundColor = '#fff3cd'; // yellow
    falseReports++;
    setTimeout(showNextEmail, 100);
  }

  reportBtn.disabled = true;
  trustBtn.disabled = true;
  checkGameEnd();
});


trustBtn.addEventListener('click', () => {
  const current = randomEmails[selectedIndex];
  const box = emailBoxes[selectedIndex];
  current.phished = true;

  if (current.answered) return;
  current.answered = true;
  handledCount++;

  if (!current.isPhishing) {
    box.style.backgroundColor = '#d4edda'; // green
    updateScore(10);
    safeTrusts++;
  } else {
    box.style.backgroundColor = '#f8d7da'; // red
    phishingMistakes++;
    current.phished = true;
  }

  reportBtn.disabled = true;
  trustBtn.disabled = true;
  setTimeout(showNextEmail, 100);
  checkGameEnd();
});



  let pendingRedirectHref = null;

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    const href = link.getAttribute('href');

    // Only intercept navigation if game is *in progress*
    if (handledCount > 0 && handledCount < randomEmails.length && href !== 'menu.html') {
      e.preventDefault();
      pendingRedirectHref = href;
      document.getElementById('leaveConfirmModal').style.display = 'flex';
    }
  });
});


const confirmLeaveBtn = document.getElementById('confirmLeaveBtn');
const cancelLeaveBtn = document.getElementById('cancelLeaveBtn');

confirmLeaveBtn.addEventListener('click', () => {
  confirmLeave(true);
});

cancelLeaveBtn.addEventListener('click', () => {
  confirmLeave(false);
});

function confirmLeave(shouldLeave) {
  const modal = document.getElementById('leaveConfirmModal');
  modal.style.display = 'none';

  if (shouldLeave && pendingRedirectHref) {
    window.location.href = pendingRedirectHref;
    pendingRedirectHref = null;
  } else {
    pendingRedirectHref = null;
  }
}


document.getElementById('playAgainBtn').addEventListener('click', () => {
  window.location.reload();
});



  
  });

  
