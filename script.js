const pagePaths = ['/', '/bio', '/brew', '/code']
const scrollSpeed = 9
let currentScreen = 0
let touchstartX = 0
let touchendX = 0
let handlingAnimation = false
let animationCounter = 0
let directionMultiplier = 1

const setCurrentPage = (pageId = 0) => {
  currentScreen = pageId
  const screenWidth = window.innerWidth
  document.getElementById('level-container').style.left = -pageId*screenWidth + 'px'
  document.getElementById('scenery-container').style.left = -parseInt(0.25 * pageId*screenWidth) + 'px'

  // Set up nav selector box
  document.getElementById('navselector').style.left = parseInt(screenWidth*(.025 + pageId*0.24)) + 'px'
}

const email_form_html = `
  <div style='width:100%;text-align:center;'>Get In Touch</div>
  <div style='width:100%;margin:10px;'>
    <label for='contactName'>Name:</label>
    <input type='text' id='contactName' name='contactName' />
    <br>
    <br>
    <label for='contactMail'>Email:</label>
    <input type='email' id='contactMail' name='contactMail' />
    <br>
    <br>
    <label for='contactPhone'>Phone:</label>
    <input type='tel' id='contactPhone' name='contactPhone' />
    <br>
    <br>
    <label for='contactMsg'>Message:</label>
    <textarea rows=8 id='contactMsg' name='contactMsg' /></textarea>
  </div>
`

function submitForm() {
  fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: "POST",
    body: JSON.stringify({
      "lib_version": "2.4.1",
      "user_id": "user_G351SbNM2Y0bWfebUkR4o",
      "service_id": "gmail",
      "template_id": "template_gy3HrNKm",
      "template_params": {
        contactMail: document.getElementById('contactMail').value,
        contactName: document.getElementById('contactName').value,
        contactPhone: document.getElementById('contactPhone').value,
        contactMsg: document.getElementById('contactMsg').value,
      }
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => {
    if (res.status === 200) {
      document.getElementById('formSubmitButton').style.visibility = 'hidden'
      document.getElementById('messageText').innerHTML = "Your message has been sent! <br><br>I'll get back to you when I can :)"
    } else {
      document.getElementById('formSubmitButton').style.visibility = 'hidden'
      document.getElementById('messageText').innerHTML = "There was an issue sending your message :( <br><br>Maybe try again later?<br><br>Or if it's urgent, reach out directly to <a href='mailto:matt@westwick.dev'>matt@westwick.dev</a>"
    }
  })
}

function scrollScreen(direction = 'right') {
  if (handlingAnimation) return
  if ((direction === 'left' && currentScreen === 0) || (direction === 'right' && currentScreen === 3)) return

  const screenWidth = window.innerWidth
  finalAnimationCounter = (screenWidth / scrollSpeed)
  handlingAnimation = true
  document.getElementById('sprite').style.backgroundImage = "url(./images/run.gif)"

  if (direction === 'left' && currentScreen > 0) {
    document.getElementById('sprite').style.transform = 'scaleX(-1)'
    directionMultiplier = 1
    currentScreen -= 1
  } else if (direction === 'right' && currentScreen < 3) {
    document.getElementById('sprite').style.transform = 'scaleX(1)'
    directionMultiplier = -1
    currentScreen += 1
  }

  requestAnimationFrame(animateScroll)
}

function scrollToScreen(targetScreenId = 0) {
  if (handlingAnimation) return
  if (targetScreenId === currentScreen) return

  const totalMovement = window.innerWidth * -(targetScreenId - currentScreen)
  finalAnimationCounter = Math.abs(totalMovement / scrollSpeed)
  handlingAnimation = true
  document.getElementById('sprite').style.backgroundImage = "url(./images/run.gif)"

  if (totalMovement > 0) {
    document.getElementById('sprite').style.transform = 'scaleX(-1)'
    directionMultiplier = 1
  } else if (totalMovement < 0) {
    document.getElementById('sprite').style.transform = 'scaleX(1)'
    directionMultiplier = -1
  }

  currentScreen = targetScreenId

  requestAnimationFrame(animateScroll)
}
    
function checkSwipeDirection() {
  const magnitude = Math.abs(touchendX - touchstartX)
  if (magnitude < 80) return

  if (touchendX < touchstartX) {
    scrollScreen('right')
  }

  if (touchendX > touchstartX) {
    scrollScreen('left')
  } 
}

function animateScroll() {
  const currentPosition = document.getElementById('level-container').getBoundingClientRect()
  document.getElementById('level-container').style.left = (parseInt(currentPosition.left) + (directionMultiplier*scrollSpeed)) + 'px'
  document.getElementById('floor').style.backgroundPositionX =(parseInt(currentPosition.left) + (directionMultiplier*scrollSpeed)) + 'px'
  document.getElementById('scenery-container').style.left = parseInt(0.25 * (parseInt(currentPosition.left) + (directionMultiplier*scrollSpeed))) + 'px'
  document.getElementById('navselector').style.left = parseInt((window.innerWidth*.025) + (-0.24 * (parseInt(currentPosition.left) + (directionMultiplier*scrollSpeed)))) + 'px'
  animationCounter += 1

  if (animationCounter < finalAnimationCounter) {
    requestAnimationFrame(animateScroll)
  } else {
    window.history.pushState({}, "", window.location.origin + pagePaths[currentScreen] )
    animationCounter = 0
    finalAnimationCounter = 0
    document.getElementById('sprite').style.transform = 'scaleX(1)'
    document.getElementById('sprite').style.backgroundImage = "url(./images/stand.png)"
    handlingAnimation = false
  }
}

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX
})

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX
  checkSwipeDirection()
})

const setupButtons = () => {
  document.getElementById('rightButton').addEventListener("click", (evt) => {
    evt.stopPropagation()
    scrollScreen('right')
  })
  
  document.getElementById('leftButton').addEventListener("click", (evt) => {
    evt.stopPropagation()
    scrollScreen('left')
  })

  document.getElementById('home').addEventListener("click", (evt) => {
    evt.stopPropagation()
    scrollToScreen(0)
  })

  document.getElementById('bio').addEventListener("click", (evt) => {
    evt.stopPropagation()
    scrollToScreen(1)
  })

  document.getElementById('brew').addEventListener("click", (evt) => {
    evt.stopPropagation()
    scrollToScreen(2)
  })

  document.getElementById('code').addEventListener("click", (evt) => {
    evt.stopPropagation()
    scrollToScreen(3)
  })
}