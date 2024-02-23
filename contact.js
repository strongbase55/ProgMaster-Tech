// function sendMail() {
//     var params = {
//       name: document.getElementById("name").value,
//       email: document.getElementById("email").value,
//       message: document.getElementById("message").value,
//     };

//     const serviceID = "service_yntigur";
//     const templateID = "template_igoxysg";

//       emailjs.send(serviceID, templateID, params)
//       .then(res=>{
//           document.getElementById("name").value = "";
//           document.getElementById("email").value = "";
//           document.getElementById("message").value = "";
//           console.log(res);
//           alert("We Got Your Message! Our Team Will Get Back To You Soon")

//       })
//       .catch(err=>console.log(err));

//   }


const btn = document.getElementById('button');

document.getElementById('form')
    .addEventListener('submit', function(event) {
        event.preventDefault();

        btn.value = 'Sending...';

        const serviceID = 'service_hzht0vr';
        const templateID = 'template_cfo98ai';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                btn.value = 'Send Email';
                alert('Sent!');
            }, (err) => {
                btn.value = 'Send Email';
                alert(JSON.stringify(err));
            });
    });