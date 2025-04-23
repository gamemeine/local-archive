import { DataInstance } from '../interfaces/dataInstance';

export const MockPhotos: DataInstance[] = [
  {
    year: 2023,
    photo: 'styrta.jpg',
    month: 10,
    day: 15,
    location: 'Lipinki Łużyckie',
    content: 'Styrta',
    postalCode: '21-370',
    private: false,
    id: 'lipinki',
  },
  {
    year: 2015,
    photo: 'dworzec.jpg',
    month: 10,
    day: 16,
    location: 'Łuków',
    content: 'Dworzec w Łukowie',
    postalCode: '00-420',
    id: 'dworzec',
    // private: true
  },
  {
    year: 2024,
    photo: 'unit.jpg',
    month: 5,
    day: 12,
    location: 'Rondo Daszyńskiego 1, Warszawa',
    content: 'Warsaw Unit, Warta',
    postalCode: '00-843',
    id: '1',
    // private: true
  },
  {
    year: 2024,
    photo: 'pkin.jpg',
    month: 5,
    day: 12,
    location: 'plac Defilad 1, Warszawa',
    content: 'Pałac Kultury i Nauki',
    postalCode: '00-901',
    id: '2',
    // private: true
  },
  {
    year: 2025,
    photo: 'cracow.jpg',
    month: 4,
    day: 23,
    location: 'Rynek Główny 7, Kraków',
    content: 'Rynek w Krakowie',
    postalCode: '31-042',
    id: '3',
    // private: true
  },
];
