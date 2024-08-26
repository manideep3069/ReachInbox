document.addEventListener("DOMContentLoaded", function () {
  const emailListDiv = document.getElementById("emailList");
  const emailDetailsDiv = document.getElementById("emailDetails");
  const subjectSpan = document.getElementById("subject");
  const fromSpan = document.getElementById("from");
  const toSpan = document.getElementById("to");
  const bodyParagraph = document.getElementById("body");
  const replyButton = document.getElementById("replyButton");
  const deleteButton = document.getElementById("deleteButton");

  // Replace with your actual token
  const token = "your-bearer-token-here";

  // Fetch the list of emails
  fetch("https://hiring.reachinbox.xyz/api/v1/onebox/list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === 200) {
        data.emails.forEach((email) => {
          const emailDiv = document.createElement("div");
          emailDiv.textContent = email.subject;
          emailDiv.addEventListener("click", function () {
            fetchEmailDetails(email.thread_id);
          });
          emailListDiv.appendChild(emailDiv);
        });
      } else {
        alert("Failed to load emails");
      }
    });

  function fetchEmailDetails(thread_id) {
    fetch(`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${thread_id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          emailDetailsDiv.style.display = "block";
          subjectSpan.textContent = data.email.subject;
          fromSpan.textContent = data.email.from;
          toSpan.textContent = data.email.to;
          bodyParagraph.innerHTML = data.email.body;

          // Handle reply and delete actions
          replyButton.onclick = function () {
            openReplyBox(thread_id);
          };
          deleteButton.onclick = function () {
            deleteEmailThread(thread_id);
          };
        } else {
          alert("Failed to load email details");
        }
      });
  }

  function openReplyBox(thread_id) {
    // Create a simple reply box UI
    const replyBox = document.createElement("div");
    replyBox.innerHTML = `
            <h3>Reply to Email</h3>
            <div class="input-group">
                <label for="to">To</label>
                <input type="email" id="replyTo" value="" required />
            </div>
            <div class="input-group">
                <label for="subject">Subject</label>
                <input type="text" id="replySubject" value="" required />
            </div>
            <div class="input-group">
                <label for="body">Body</label>
                <textarea id="replyBody" rows="5" required></textarea>
            </div>
            <button id="sendReplyButton">Send Reply</button>
        `;
    emailDetailsDiv.appendChild(replyBox);

    // Prefill the "To" and "Subject" fields based on the selected email
    document.getElementById("replyTo").value =
      document.getElementById("from").textContent;
    document.getElementById("replySubject").value = `Re: ${
      document.getElementById("subject").textContent
    }`;

    // Handle sending the reply
    document
      .getElementById("sendReplyButton")
      .addEventListener("click", function () {
        const toEmail = document.getElementById("replyTo").value;
        const subject = document.getElementById("replySubject").value;
        const body = document.getElementById("replyBody").value;

        const replyPayload = {
          to: toEmail,
          from: "your-email@example.com", // Replace with your actual email
          fromName: "Your Name", // Replace with your name
          subject: subject,
          body: `<p>${body}</p>`,
          references: [
            // Add any necessary references or keep it as an empty array if not needed
          ],
          inReplyTo: "your-reference-id", // Replace with the appropriate reference ID
        };

        fetch(
          `https://hiring.reachinbox.xyz/api/v1/onebox/reply/${thread_id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(replyPayload),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.status === 200) {
              alert("Reply sent successfully");
              emailDetailsDiv.removeChild(replyBox); // Remove the reply box after sending
            } else {
              alert("Failed to send reply");
            }
          });
      });
  }

  function deleteEmailThread(thread_id) {
    fetch(`https://hiring.reachinbox.xyz/api/v1/onebox/messages/${thread_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          alert("Email deleted successfully");
          window.location.reload(); // Reload the list after deletion
        } else {
          alert("Failed to delete email");
        }
      });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", function (event) {
    const selectedThreadId = "some-thread-id"; // Replace with the logic to get the currently selected thread ID

    if (event.key === "d" || event.key === "D") {
      // Delete the selected email
      if (selectedThreadId) {
        deleteEmailThread(selectedThreadId);
      } else {
        alert("No email selected");
      }
    } else if (event.key === "r" || event.key === "R") {
      // Open the reply box for the selected email
      if (selectedThreadId) {
        openReplyBox(selectedThreadId);
      } else {
        alert("No email selected");
      }
    }
  });
});
