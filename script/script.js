document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Вывод элементов DOM
  const btnOpenModal = document.querySelector('#btnOpenModal'),
    modalBlock = document.querySelector('#modalBlock'),
    closeModal = document.querySelector('#closeModal'),
    questionTitle = document.querySelector('#question'),
    formAnswers = document.querySelector('#formAnswers'),
    burgerBtn = document.getElementById('burger'),
    prevButton = document.querySelector('#prev'),
    nextButton = document.querySelector('#next'),
    modalDialog = document.querySelector('.modal-dialog');

  // Массив вопросов
  const questions = [
    {
      question: "Какого цвета бургер?",
      answers: [
        {
          title: 'Стандарт',
          url: './image/burger.png'
        },
        {
          title: 'Черный',
          url: './image/burgerBlack.png'
        }
      ],
      type: 'radio'
    },
    {
      question: "Из какого мяса котлета?",
      answers: [
        {
          title: 'Курица',
          url: './image/chickenMeat.png'
        },
        {
          title: 'Говядина',
          url: './image/beefMeat.png'
        },
        {
          title: 'Свинина',
          url: './image/porkMeat.png'
        }
      ],
      type: 'radio'
    },
    {
      question: "Дополнительные ингредиенты?",
      answers: [
        {
          title: 'Помидор',
          url: './image/tomato.png'
        },
        {
          title: 'Огурец',
          url: './image/cucumber.png'
        },
        {
          title: 'Салат',
          url: './image/salad.png'
        },
        {
          title: 'Лук',
          url: './image/onion.png'
        }
      ],
      type: 'checkbox'
    },
    {
      question: "Добавить соус?",
      answers: [
        {
          title: 'Чесночный',
          url: './image/sauce1.png'
        },
        {
          title: 'Томатный',
          url: './image/sauce2.png'
        },
        {
          title: 'Горчичный',
          url: './image/sauce3.png'
        }
      ],
      type: 'radio'
    }
  ];

  // Появление-исчезание кнопки-бургера (начальная проверка)
  let clientWidth = document.documentElement.clientWidth;

  if (clientWidth < 768) {
    burgerBtn.style.display = 'flex';
  } else {
    burgerBtn.style.display = 'none';
  }

  // Прохождение опроса
  const playTest = () => {
    let numberQuestion = 0;

    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {

        const answerItem = document.createElement('div');

        answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
        answerItem.innerHTML = `
          <input type="${questions[index].type}" id="${answer.title}"      name="answer" class="d-none">
          <label for="${answer.title}" class="d-flex flex-column justify-content-between">
          <img class="answerImg" src="${answer.url}" alt="burger">
          <span>${answer.title}</span>
          </label>
        `;
        formAnswers.appendChild(answerItem);
      });
    }

    const renderQuestions = (indexQuestion) => {
      formAnswers.innerHTML = '';
      questionTitle.textContent = `${questions[indexQuestion].question}`;
      renderAnswers(indexQuestion);
    }
    renderQuestions(numberQuestion);

    nextButton.onclick = () => {
      numberQuestion++;
      renderQuestions(numberQuestion);
    };
    prevButton.onclick = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    };

  };

  // Появление-исчезание кнопки-бургера (проверка при изменении экрана)

  window.addEventListener('resize', () => {
    clientWidth = document.documentElement.clientWidth;

    if (clientWidth < 768) {
      burgerBtn.style.display = 'flex';
    } else {
      burgerBtn.style.display = 'none';
    }
  });

  // Открытие модального окна по клику на кнопку-бургер
  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.add('active');
    modalBlock.classList.add('d-block');
    playTest();
  });

  // Анимация открытия модального окна по кнопке внизу
  let count = -100;

  modalDialog.style.top = count + '%';

  const animateModal = () => {
    modalDialog.style.top = count + '%';
    count += 3;
    if (count < 0) {
      requestAnimationFrame(animateModal);
    } else {
      count = -100;
    }
  };

  // Открытие модального окна по кнопке внизу
  btnOpenModal.addEventListener('click', () => {
    requestAnimationFrame(animateModal);
    modalBlock.classList.add('d-block');
    playTest();
  });

  // Закрытие модального окна по нажатию креста в модальном окне
  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
    burgerBtn.classList.remove('active');
  });

  // Закрытие модального окна по нажатию мимо модального окна или на крест вместо кнопки-бургера

  document.addEventListener('click', (event) => {
    if (
      !event.target.closest('.modal-dialog') &&
      !event.target.closest('.openModalButton') &&
      !event.target.closest('.burger')
    ) {
      modalBlock.classList.remove('d-block');
      burgerBtn.classList.remove('active');
    }
  });



});