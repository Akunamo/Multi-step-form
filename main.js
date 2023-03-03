const nextButtons = Array.from(document.querySelectorAll('.next,.back'));
let planToggleButtons = Array.from(document.querySelectorAll('.plan-type input'));
let changeButton = document.querySelector('.change');

const userInfo = new Map();
const info = new Map();
let planType;
const addOns = [];

changeButton.addEventListener('click', goToPlanSelection)
planToggleButtons.forEach(btn => btn.addEventListener('click', changePlanType))
nextButtons.forEach(e => e.addEventListener('click', changeForm))

function goToPlanSelection() {
    Array.from(document.querySelectorAll('form,section:not(.steps)')).forEach(section => {
        section.classList.add('none');
        if (section.matches('.plans-section')) section.classList.remove('none')
    })
}

function changeForm(e) {
    const step = document.querySelector('.step-indicator.active');
    const currentSection = e.target.closest('form,section');
    direction = e.target.matches('.next') ? 'nextElementSibling' : 'previousElementSibling';

    // check form validity / if user has selected any plan
    if (direction === "nextElementSibling" && !checkUserInput(currentSection)) return;

    // switch to next section
    currentSection.classList.add('none');
    currentSection[direction].classList.remove('none');

    // styling steps depending on switch section we are on
    if (step[direction]) {
        step.classList.remove('active')
        step[direction].classList.add('active')
    }

    // save user input from current section
    getData(currentSection);
}

function checkUserInput(section) {
    if (section.matches('.user-info-section')) return isFormValidation(section);
    if (section.matches('.plans-section')) return notSelected(section);
    return true
}

function isFormValidation(section) {
    [...document.querySelectorAll('.error')].forEach(err => {
        err.innerText = ""
    })
    const name = section.querySelector('#name');
    const email = section.querySelector('#email');
    const phone = section.querySelector('#phone');

    if (!isInputValidated(name, 6, 20)) return false;
    if (!isInputValidated(email)) return false;
    if (!isInputValidated(phone, 10, 15)) return false;

    return true;
}
function isInputValidated(input, min = 0, max = 40) {
    const val = input.value;
    if(val === "") {
        notValidError(input.id,'This field is required');
        return false;
    }
    if(val.length < min) {
        notValidError(input.id,`must contain atleast ${min} characters`);
        return false;
    }
    if(val.length > max) {
        notValidError(input.id,`c'mon man really`);
        return false;
    }
    if(input.id === 'email'){
        result = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)
        if(!result){
            notValidError(input,`Invalid email`);
            return false;
        }
    }
    return true;
}

// funtion to show error to user
function notValidError(target, error) {
    document.querySelector(`.${target}.error`).innerText = error;
}
// if no plans selected return false
function notSelected(section) {
    if (!section.querySelector('.plans input:checked')) {
        notValidError('notSelected', 'Please select one to continue')
        return false;
    }
    return true
}
// change styles depending on plan type (monthly/yearly)
function changePlanType(e) {
    const show = e.target.id === 'yearly' ? 'yearly' : 'monthly'
    Array.from(document.querySelectorAll(`.${show}`)).forEach(el => el.style.display = 'inline');
    const hide = show === 'yearly' ? 'monthly' : 'yearly';
    Array.from(document.querySelectorAll(`.${hide}`)).forEach(el => el.style.display = 'none');
}

function getData(section) {
    if (section.matches('.user-info-section')) {
        [...section.querySelectorAll('input')].forEach(input => {
            userInfo.set(input.id, input.value)
        })
    }

    if (section.matches('.plans-section')) {
        planType = section.querySelector('.plan-type input:checked').id;
        const plan = section.querySelector('.plans input:checked');
        const planCost = section.querySelector(`label[for="${plan.id}"] > .${planType}`).getAttribute('data-val');

        info.set('plan', plan.id)
        info.set('planCost', parseInt(planCost));
    }

    if (section.matches('.add-ons-section')) {

        addOns.length = 0;
        [...section.querySelectorAll('input:checked')].forEach((input) => {
            
            const label = section.querySelector(`label[for=${input.id}]`);

            const name = label.querySelector('[data-addOn]').innerText
            const dataVal = label.querySelector(`.${planType}[data-val]`);

            addOns.push({
                name: name,
                cost: parseInt(dataVal.getAttribute('data-val'))
            })
        })
    }
    assignToRecipt();
}

function assignToRecipt() {
    let f = document.querySelector('.finalization');
    const recipt = f.querySelector('.final-result');

    // i suck at naming
    const pt = planType === 'monthly' ? '/mo' : '/yr'
    let total;

    // clear all addOns from recipt
    Array.from(recipt.querySelectorAll('.purchase:not(.purchase-plan)')).forEach(el => el.remove());

    // add plan in recipt
    info.forEach((val, key) => {
        f.querySelector(`[data-${key}]`).innerText = val;
        total = val;
    })

    // add all addons in recipt
    addOns.forEach(el => {
        const newAddOn = document.createElement('div');
        newAddOn.classList.add('purchase');
        newAddOn.innerHTML = `<p>${el.name}</p><p>$${el.cost}${pt}</p>`
        total += el.cost;
        recipt.appendChild(newAddOn)
    })
    f.querySelector('.total-price').innerText = `$${total}${pt}`
    f.querySelector('.total .type').innerText = `Total(per ${planType === 'monthly'?'month':'year'})`

}


        // BAD CODE SAMPLE

    // it will check all field regardless of weather a field is already invalid
    // so it will go all the way even when it don't have to

    // const  validName = validate(name,6,20);
    // const  validEmail = validate(email);
    // const  validPhone = validate(phone,10,15);

    // if (validName && validEmail && validPhone) return true
    // console.log(false);
    // return false;