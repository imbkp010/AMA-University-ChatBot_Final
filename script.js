const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const GROQ_API_KEY = config.GROQ_API_KEY;;          //---------------// (secrets.GROQ_API_KEY) Replace with your Groq API key //---------------//
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent =
    className === "outgoing"
      ? `<p></p>`
      : `<img src="public/images/ama-logo.jpg" alt="AMA Logo" class="chat-logo"><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};


const generateResponse = (chatElement) => {
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";  const messageElement = chatElement.querySelector("p");

  const systemContext = `I am an AI assistant for AMA Education System. I can help you with information about programs, admissions, facilities, and student services. Here are the official AMA Education System resources I can refer to:

Main Website: https://www.amaes.edu.ph/
Career Profiler: https://www.amaes.edu.ph/career-profiler/
About AMA: https://www.amaes.edu.ph/about-the-ama-education-system/

Programs:
- Basic Education: https://www.amaes.edu.ph/programs-offered-basic-education/
- Aviation/Delta Air: https://www.amaes.edu.ph/programs-offered-aviation-delta-air/
- Medical/Nursing/Allied Health: https://www.amaes.edu.ph/programs-offered-medical-nursing-allied-health/
- Accountancy: https://www.amaes.edu.ph/programs-offered-accountancy/
- Arts and Sciences: https://www.amaes.edu.ph/programs-offered-arts-and-sciences/
- Education: https://www.amaes.edu.ph/programs-offered-education/
- Hospitality and Tourism: https://www.amaes.edu.ph/programs-offered-hospitality-tourism/
- Business Administration: https://www.amaes.edu.ph/programs-offered-business-and-management/
- Computer Engineering: https://www.amaes.edu.ph/programs-offered-engineering/
- Computer Studies: https://www.amaes.edu.ph/programs-offered-computing/

Student Services:
- Enrollment Schedule: https://www.amaes.edu.ph/enrollment-schedule-for-ama-senior-high/
- Student Portal: https://www.amaes.edu.ph/register-portal/
- Microsoft 365 Benefits: https://www.amaes.edu.ph/microsoft-login/
- Scholarships: https://www.amaes.edu.ph/scholarship-programs/
- Online Pre-registration: https://www.amaes.edu.ph/amaes-online-pre-registration/
- Online Helpdesk: https://www.amaes.edu.ph/request-page/
- Blended Learning Portal: https://www.amaes.edu.ph/ama-blended-learning-student-login/

Your primary objective is to share reliable details about AMA University and its member schools. Encourage users to explore and enroll in AMA programs while focusing solely on questions related to AMA or its member institutions.

Avoid responding to non-educational inquiries or topics unrelated to AMA University.`
;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.2-90b-vision-preview",
      messages: [
        { role: "system", content: systemContext },
        { role: "user", content: userMessage }
      ],
      temperature: 0.3,
    }),
  };

  // Send POST request to API, get response and set the reponse as paragraph text
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content.trim();
    })
    .catch(() => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;

  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Display "Thinking..." message while waiting for the response
    const incomingChatLi = createChatLi("Typing...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  // If Enter key is pressed without Shift key and the window
  // width is greater than 800px, handle the chat
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
