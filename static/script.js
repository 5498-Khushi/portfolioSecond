let container = document.getElementById("cert-container")

fetch("/certifications")
.then(res => res.json())
.then(data => {

data.forEach(cert => {

container.innerHTML += `

<div class="card">

<h3>${cert.name}</h3>
<p>${cert.platform}</p>

<button onclick="openCertModal('${cert.image}')">
View Certificate
</button>

</div>

`

})

})

let modal = document.getElementById("modal")
let modalImg = document.getElementById("modalImg")

function openCertModal(url){

console.log("URL:",url)

document.getElementById("modal").style.display="flex"

document.getElementById("modalImg").src = url

}


function closeCertModal(){

document.getElementById("modal").style.display="none"

}
document.getElementById("close").onclick = function(){

closeCertModal()

}

// Send contact message
function sendMessage() {
    const name = document.getElementById('contactName')?.value;
    const email = document.getElementById('contactEmail')?.value;
    const message = document.getElementById('contactMessage')?.value;
    const statusDiv = document.getElementById('messageStatus');
    const sendBtn = document.getElementById('sendBtn');
    
    // Check if fields exist
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Disable button and show sending status
    if (sendBtn) sendBtn.disabled = true;
    if (sendBtn) sendBtn.textContent = 'Sending...';
    if (statusDiv) statusDiv.innerHTML = '<p style="color: #90EE90;">Sending...</p>';
    
    // Send to backend
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showModal();
            // Clear form
            document.getElementById('contactName').value = '';
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactMessage').value = '';
             // Clear status message
            if (statusDiv) {
                statusDiv.innerHTML = '';
            }
        } else {
            if (statusDiv) {
                statusDiv.innerHTML = '<p style="color: #ffaaaa;">❌ Error: ' + data.error + '</p>';
            }
            setTimeout(() => {
                if (statusDiv) statusDiv.innerHTML = '';
            }, 3000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        if (statusDiv) {
            statusDiv.innerHTML = '<p style="color: #ffaaaa;">❌ Network error. Please try again.</p>';
        }
        setTimeout(() => {
            if (statusDiv) statusDiv.innerHTML = '';
        }, 3000);
    })
    .finally(() => {
        // Re-enable button
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send Message';
        }
    });
}

function showModal() {
    document.getElementById('successModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}