const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const API_KEY = "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"; 
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL_NAME = "gpt-3.5-turbo";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = document.createElement("div");
    chatContent.classList.add("chat");
    
    if (className === "outgoing") {
      chatContent.classList.add("outgoing");
      const pElement = document.createElement("p");
      chatContent.appendChild(pElement);
    } else {
      chatContent.classList.add("incoming");
      const spanElement = document.createElement("span");
      spanElement.classList.add("material-symbols-outlined");
      spanElement.textContent = "smart_toy";
    
      const pElement = document.createElement("p");
      chatContent.appendChild(spanElement);
      chatContent.appendChild(pElement);
    }
    chatLi.appendChild(chatContent);
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
};

const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: [{role: "user", content: userMessage}],
        })
    };
    console.log("API Request:", requestOptions);

    fetch(API_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
        console.log("API Response:", data);
        const responseMessage = data.choices[0]?.message?.content.trim();
        console.log("Response Message:", responseMessage);
        userMessage = responseMessage || "No response from the model.";
        console.log("Updated userMessage:", userMessage);
        messageElement.textContent = userMessage;
    })
    .catch(error => {
        console.error("API Error:", error);
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

const handleChat = () => {
    userMessage = chatInput.value.trim(); 
    if(!userMessage) return;

    chatInput.value = '';
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));