/* LAPIS — Museo di Archeologia Romana e Medievale
   Script unico: menù mobile, filtri per epoca nelle collezioni, anno nel piè di pagina. */

document.addEventListener("DOMContentLoaded", function () {
  // Menù di navigazione su schermi piccoli
  var interruttore = document.querySelector(".nav-interruttore");
  var lista = document.querySelector(".nav-lista");

  if (interruttore && lista) {
    interruttore.addEventListener("click", function () {
      var aperta = lista.classList.toggle("aperta");
      interruttore.setAttribute("aria-expanded", aperta ? "true" : "false");
      interruttore.textContent = aperta ? "Chiudi indice" : "Indice delle sale";
    });
  }

  // Filtri delle collezioni: mostrano solo le schede con l'epoca scelta
  var filtri = document.querySelectorAll(".filtri button");
  var schede = document.querySelectorAll(".griglia-reperti .scheda");
  var avviso = document.querySelector(".nessun-risultato");

  filtri.forEach(function (bottone) {
    bottone.addEventListener("click", function () {
      filtri.forEach(function (altro) {
        altro.classList.remove("attivo");
      });
      bottone.classList.add("attivo");

      var epoca = bottone.getAttribute("data-epoca");
      var visibili = 0;

      schede.forEach(function (scheda) {
        var corrisponde = epoca === "tutte" || scheda.getAttribute("data-epoca") === epoca;
        scheda.style.display = corrisponde ? "" : "none";
        if (corrisponde) {
          visibili += 1;
        }
      });

      if (avviso) {
        avviso.style.display = visibili === 0 ? "block" : "none";
      }
    });
  });

  // Anno corrente nel piè di pagina
  document.querySelectorAll(".anno-corrente").forEach(function (nodo) {
    nodo.textContent = new Date().getFullYear();
  });
});
