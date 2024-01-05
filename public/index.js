const toggle = document.querySelector("#toggle")
const toggleCheckBox = document.querySelector("#toggleSwitch")

fetch(`/recent-state`)
  .then(response => response.json())
  .then(message => {
    if(message.isOn === 1) {
    toggle.textContent = "ON";
    toggleCheckBox.checked = true;

    }
    else{
    toggle.textContent = "OFF";
    toggleCheckBox.checked = false;

      }
    console.log("recent-state message: ", message);
  })
  .catch(error => console.error('Error:', error));

function toggleLED() {

fetch(`/toggle?state=${toggleSwitch.checked ? 'on' : 'off'}`, { method: 'POST' })
.then(response => response.json())
.then(message => {
 if(message.isOn === 1) {
    toggle.textContent = "ON";
    toggleCheckBox.checked = true;

    }
    else{
    toggle.textContent = "OFF";
    toggleCheckBox.checked = false;

      }
  
console.log(message);
})
.catch(error => console.error('Error:', error));
}
