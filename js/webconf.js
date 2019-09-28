window.onload = function () {
    const urlBase = "https://fcawebbook.herokuapp.com"
    const btnRegister = document.getElementById("btnRegister")

    /* ação do btnRegister */
    btnRegister.addEventListener("click", function () {
        swal({
            title: "Inscrição na WebConference",
            html:
                '<div class="sweetAlertTit">Nome:</div>' +
                '<input id="swal-input1" class="swal2-input" placeholder="nome">' +
                '<div class="sweetAlertTit">E-mail</div>' +
                '<input id="swal-input2" class="swal2-input" placeholder="e-mail">',
            showCancelButton: true,
            confirmButtonText: "Inscrever",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const name = document.getElementById('swal-input1').value
                const email = document.getElementById('swal-input2').value

                return fetch(`${urlBase}/conferences/1/participants/${email}`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    body: `nomeparticipant=${name}`
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        swal.showValidationError(`Request failed: ${error}`);
                    });
            },
            allowOutsideClick: () => !swal.isLoading()
        }).then(result => {
            if (result.value) {
                if (!result.value.err_code) {
                    swal({ title: "Inscrição feita com sucesso!" })
                } else {
                    swal({ title: `${result.value.err_message}` })
                }
            }
        });
    });

    /* 
        Get speakers from server
    */
    (async () => {
        const renderSpeakers = document.getElementById("a")
        let txtSpeakers = ""
        const response = await fetch(`${urlBase}/conferences/1/speakers`)
        const speakers = await response.json()

        for (const speaker of speakers) {
            txtSpeakers += `
          <div class="col-sm-4">
            <div class="team-member">      
              <img id="${speaker.idSpeaker}" class="mx-auto rounded-circle viewSpeaker" src="${speaker.foto}" alt="">
              <h4>${speaker.nome}</h4>
              <p class="text-muted">${speaker.cargo}</p>
              <ul class="list-inline social-buttons">`
            if (speaker.twitter !== null) {
                txtSpeakers += `
              <li class="list-inline-item">
                <a href="${speaker.twitter}" target="_blank">
                  <i class="fab fa-twitter"></i>
                </a>
              </li>`
            }
            if (speaker.facebook !== null) {
                txtSpeakers += `
              <li class="list-inline-item">
                <a href="${speaker.facebook}" target="_blank">
                  <i class="fab fa-facebook-f"></i>
                </a>
              </li>`
            }
            if (speaker.linkedin !== null) {
                txtSpeakers += `
              <li class="list-inline-item">
                <a href="${speaker.linkedin}" target="_blank">
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </li>`
            }
            txtSpeakers += `                
              </ul>
            </div>
          </div>
          `
        }
        renderSpeakers.innerHTML = txtSpeakers
        // Gerir clique na imagem para exibição da modal    
        const btnView = document.getElementsByClassName("viewSpeaker")
        for (let i = 0; i < btnView.length; i++) {
          btnView[i].addEventListener("click", () => {         
            for (const speaker of speakers) {
                if (speaker.idSpeaker == btnView[i].getAttribute("id")) {
                  swal({
                    title: speaker.nome,
                    text: speaker.bio,
                    imageUrl: speaker.foto,
                    imageWidth: 400,
                    imageHeight: 400,
                    imageAlt: 'Foto do orador',
                    animation: false
                  })                 
                }
            }
          })
        }


      }
    )


/*
  Get sponsors from server
*/

( async () => {
  const renderSponsors = document.getElementById("renderSponsors")
  let txtSponsors = ""
  const response = await fetch(`${urlBase}/conferences/1/sponsors`)
  const sponsors = await response.json()

  for (const sponsor of sponsors) {
    txtSponsors += `
    <div class="col-md-3 col-sm-6">
      <a href="#" target="_blank">
        <img class="img-fluid d-block mx-auto" src="${sponsor.logo}" alt="${sponsor.nome}">
      </a>
    </div>`
  }  
  renderSponsors.innerHTML = txtSponsors
})();
}