document.getElementById("packeta-button").addEventListener("click", () => {
  Packeta.Widget.pick(
    {
      webUrl: "https://www.zasilkovna.cz",
      country: "cz",
      language: "cs",
      zpointId: null,
    },
    function(point) {
      if (point) {
        document.getElementById("packeta-branch-id").value = point.id;
        document.getElementById("packeta-button").innerText = `Zvoleno: ${point.name}`;
        console.log("Zvolené výdejní místo:", point);
      }
    }
  );
});