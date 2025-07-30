document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const fileInput = document.getElementById("imageInput");
  formData.append("image", fileInput.files[0]);

  const res = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  document.getElementById("resultText").innerText = data.translatedText;
});

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const text = document.getElementById("resultText").innerText;
  doc.text(text, 10, 10);
  doc.save("translated.pdf");
}