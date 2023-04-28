// Czekam na wczytanie kodu HTML i dopiero wtedy wykonuję JS
document.addEventListener('DOMContentLoaded', init);

function init() {
  // Definiuję wszystkie niezbędne dane dla pól formularza
  const fields = [
    {
      name: 'firstName',
      label: 'Imię',
      required: true,
      pattern: '^[a-zA-Z –-]+$',
    },
    {
      name: 'lastName',
      label: 'Nazwisko',
      required: true,
      pattern: '^[a-zA-Z –-]+$',
    },
    { name: 'street', label: 'Ulica', required: true },
    {
      name: 'houseNumber',
      label: 'Numer budynku',
      type: 'number',
      required: true,
    },
    { name: 'flatNumber', label: 'Numer mieszkania', type: 'number' },
    {
      name: 'zip',
      label: 'Kod pocztowy',
      pattern: '^[0-9]{2}-[0-9]{3}$',
      required: true,
    },
    {
      name: 'city',
      label: 'Miasto',
      required: true,
      pattern: '^[a-zA-Z –-]+$',
    },
    { name: 'voivodeship', label: 'Województwo', required: true },
    {
      name: 'mobileNumber',
      label: 'Numer telefonu komórkowego',
      type: 'number',
      pattern: '^[1-9]{9}$',
      required: true,
    },
    {
      name: 'description',
      label: 'Temat rozmowy',
      required: true,
      htmlEl: 'textarea',
    },
  ];

  // Tworzę i dodaję do elementu body listę <ul>, która przyda się do wyświetlania użytkownikowi błędów
  const ulEl = document.createElement('ul');
  document.body.appendChild(ulEl);

  // Tworzę element formularza
  const form = document.createElement('form');

  // Przypisuję do niego nasłuchiwanie na event 'submit'
  // Po submicie uruchomi się funkcja handle Submit
  form.addEventListener('submit', handleSubmit);

  // Tymczasowo dodaję atrybut 'novalidate', by przeglądarka „nie przeszkadzała” mi w sprawdzaniu działania mojej własnej walidacji
  form.setAttribute('novalidate', '');

  // Dodaję cały formularz do elementu body
  document.body.appendChild(form);

  // Iteruję po elementach tablicy 'field' i dla każdego z nich tworzę element HTML
  fields.forEach(function (field) {
    // Tworzę element label z adekwatną nazwą "pobraną" z obiektu reprezentującego dane pole
    const label = document.createElement('label');
    label.innerText = field.label;

    // Tworzę pole formularza: input lub textarea
    const fieldEl =
      field.htmlEl === 'textarea'
        ? document.createElement('textarea')
        : document.createElement('input');

    // Do elementu input/textarea dodaję atrybuty wskazane w obiekcie
    // Jeśli w obiekcie nie ma informacji o danym atrybucie, ustawiam wartość domyślną dzięki operatorowi 'or', czyli ||
    fieldEl.setAttribute('type', field.type || 'text');
    fieldEl.setAttribute('name', field.name);
    fieldEl.setAttribute('required', field.required || false);
    if (field.pattern) {
      fieldEl.setAttribute('pattern', field.pattern);
    }

    // Dodaję input/textarea do elementu label
    label.appendChild(fieldEl);

    // Opcjonalnie na potrzeby stylowania:
    // tworzę div i dodaję do niego label
    // const div = document.createElement('div');
    // div.appendChild(label);

    // Dodaję label (lub div) do formularza
    form.appendChild(label);
  });

  // Tworzę przycisk 'Submit'
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.innerText = 'Wyślij';

  // Dodaję przycisk do formularza
  form.appendChild(submitButton);

  // Obsługuję podsumowanie formularza (po kliknięciu „Wyślij”)
  function handleSubmit(event) {
    // Nie wysyłam formularza, dzięki czemu mogę sprawdzić poprawność wprowadzonych przez użytkownika danych po stronie front endu
    event.preventDefault();

    const errors = [];

    fields.forEach(function (field) {
      // wykorzystuję właściwość obiektu o nazwie name, by pobrać wartość konkretnego elementu formularza
      const value = form.elements[field.name].value;

      if (field.required) {
        if (value.length === 0) {
          errors.push('Dane w polu ' + field.label + ' są wymagane.');
        }
      }

      if (field.type === 'number') {
        if (Number.isNaN(Number(value))) {
          errors.push('Dane w polu ' + field.label + ' muszą być liczbą.');
        }
      }

      if (field.pattern) {
        const reg = new RegExp(field.pattern);
        if (!reg.test(value)) {
          errors.push(
            'Dane w polu ' +
              field.label +
              ' zawierają niedozwolone znaki lub nie są zgodne z przyjętym w Polsce wzorem.'
          );
        }
      }
    });

    // czyszczę listę błędów
    ulEl.innerHTML = '';
    if (errors.length === 0) {
      alert('Dane zostały wypełnione prawidłowo!');

      // czyszczę pola po prawidłowym wypełnieniu formularza
      fields.forEach(function (el) {
        form[el.name].value = '';
      });
    } else {
      errors.forEach(function (text) {
        const liEl = document.createElement('li');
        liEl.innerText = text;

        ulEl.appendChild(liEl);
      });
    }
  }
}
