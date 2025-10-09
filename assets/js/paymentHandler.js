const backdrop = document.getElementById("staticBackdrop");

document.getElementById("btnDonate").addEventListener("click", () => {
  const amount = document.getElementById("inp-donation-amount").value;
  if (confirm(`Confirm payment of KES ${amount}`) === true) {
    console.log("Accepted");
    // Go endpoint to initialize mpesa stk
  } else {
    console.log("Denied");
    //return
  }
  backdrop.setAttribute("aria-hidden", "true");
});
