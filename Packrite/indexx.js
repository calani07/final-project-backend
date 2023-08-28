/*
document
  .getElementById("open-popup-btn")
  .addEventListener("click", function () {
    document.getElementById("open-popup-btn").style.display = "none";
    document.getElementsByClassName("popup")[0].classList.add("active");
  });

document
  .getElementById("dismiss-popup-btn")
  .addEventListener("click", function () {
    document.getElementById("open-popup-btn").style.display = "block";
    document.getElementsByClassName("popup")[0].classList.remove("active");
  });
  */

document.getElementById("myForm").addEventListener("submit", function (event) {
  var nameInput = document.getElementById("name");
  var phoneInput = document.getElementById("phone");
  var numberInput = document.getElementById("number");
  var atimeInput = document.getElementById("atime");
  var dtimeInput = document.getElementById("dtime");
  var slotInput = document.getElementById("slot");

  if (
    !nameInput.value ||
    !phoneInput.value ||
    !numberInput.value ||
    !atimeInput.value ||
    !dtimeInput.value ||
    !slotInput.value
  ) {
    alert("Please fill in all required fields.");
    event.preventDefault(); // Prevent the form from submitting
  }
});

const select_slot = document.querySelector("#selslot-btn");
const startTime = document.querySelector("#atime");
const endTime = document.querySelector("#dtime");
const slotAdd = document.querySelector("#slot");

select_slot.addEventListener("click", (e) => {
  e.preventDefault();
  availableSlotLink();
});

async function availableSlotLink() {
  const slotData = {
    start_time: startTime.value,
    end_time: endTime.value,
  };
  const response = await fetch("http://localhost:3000/check-available-slots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(slotData),
  });
  const result = await response.json();
  console.log(result);
  result.forEach((slotValue) => {
    const slotNumber = parseInt(slotValue.split("_")[1]); // Extract number after underscore
    const slotText = `Slot ${slotNumber}`;
    const newOption = new Option(slotText, slotNumber);
    slotAdd.add(newOption, undefined);
  });
}
const bookNow = document.querySelector("#open-popup-btn");

bookNow.addEventListener("click", (e) => {
  e.preventDefault();
  bookSlotLink();
});

async function bookSlotLink() {
  const bookData = {
    start_time: startTime.value,
    end_time: endTime.value,
    slot: slotAdd.value,
    isBeingBooked: "false",
  };
  const response = await fetch(
    "http://localhost:3000/update-parking-slot-status",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    }
  );
  const message = await response.json();
  console.log(message);
}
