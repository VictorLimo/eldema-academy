const backdrop = document.getElementById("staticBackdrop");

document.getElementById("btnDonate").addEventListener("click", () => {
  const amount = document.getElementById("inp-donation-amount").value;
  if (confirm(`Confirm payment of KES ${amount}`) === true) {
    console.log("Accepted");
  } else {
    console.log("Denied");
  }
  backdrop.setAttribute("aria-hidden", "true");
});
