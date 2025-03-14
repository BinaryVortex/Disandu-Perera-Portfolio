window.onload = function () {
    emailjs.init("VXDYkXXG4qMZYPC4U"); 
};

function sendMail() {
    const name = document.getElementById("nameInput").value;
    const email = document.getElementById("emailInput").value;
    const subject = document.getElementById("subjectInput").value;
    const message = document.getElementById("massageInput").value;


    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Subject:", subject);
    console.log("Message:", message);

    if (!name || !email || !subject || !message) {
        Swal.fire({
            icon: "warning",
            title: "Oops!",
            text: "Please fill all the fields before sending.",
            confirmButtonColor: "#ff5733",
        });
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email!",
            text: "Please enter a valid email address.",
            confirmButtonColor: "#ff5733",
        });
        return;
    }

    const params = {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        reply_to: email
    };

    emailjs.send("service_72ic4yf", "template_xvxuq3o", params)
    .then(() => {
        Swal.fire({
            icon: "success",
            title: "Sent!",
            text: "Your message has been sent successfully.",
            confirmButtonColor: "#28a745",
        });

        document.getElementById("nameInput").value = "";
        document.getElementById("emailInput").value = "";
        document.getElementById("subjectInput").value = "";
        document.getElementById("massageInput").value = "";
        
    })
    .catch((error) => {
        Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Something went wrong. Please try again later.",
            confirmButtonColor: "#ff5733",
        });
        console.error("Email send error:", error);
    });
}
