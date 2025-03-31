import {DataInstance} from '../interfaces/dataInstance'

export const MockPhotos : DataInstance[] = [
  {
    year: 2023,
    photo: "styrta.jpg",
    month: 10,
    day: 15,
    location: 'Lipinki Łużyckie',
    content: 'Styrta',
    postalCode: '21-370',
    private: false
  },
  {
    year: 2015,
    photo: 'dworzec.jpg',
    month: 10,
    day: 16,
    location: 'Łuków',
    content: 'Dworzec w Łukowie',
    postalCode: '00-420',
    private: true
  },
]
