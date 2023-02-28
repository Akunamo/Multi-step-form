const btns = Array.from(document.querySelectorAll('.next,.back'));
const inputBtns = Array.from(document.querySelectorAll('input'))




inputBtns.forEach(b => b.addEventListener('click',updateData));
function updateData(e) {
    console.log(e);
    const p = e.target.closest('.options-wrapper');
    console.log(p);
}

btns.forEach(e => e.addEventListener('click',changeForm))

function changeForm(e) {
    direction = e.target.matches('.next') ? 'nextElementSibling' : 'previousElementSibling';
    const step = document.querySelector('.step-indicator.active');
    const currentSection = e.target.closest('form,section');

    step.classList.remove('active')
    currentSection.classList.add('none');
    
    step[direction].classList.add('active')
    currentSection[direction].classList.remove('none');
}