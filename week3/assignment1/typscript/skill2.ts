
interface Book {
  title: string;
  pages: number;
}


const largeBook: Book = {
  title: "Large book",
  pages: 10090,
};

const describeBook = (book: Book): string => {
  return `The book ${book.title} has ${book.pages} pages.`;
};
console.log(describeBook(largeBook));


interface Teacher {
  name: string;
  subject: string;
}

interface Employee {
  id: number;
  email: string;
}


type SchoolTeacher = Teacher & Employee;


const teacher: SchoolTeacher = {
  name: "David",
  subject: "Computer Science",
  id: 5151,
  email: "david.gmail.com",
};

const printTeacherInfo = (teacher: SchoolTeacher): void => {
  console.log(
    `Teacher ${teacher.name} (Employee ID: ${teacher.id}) teaches ${teacher.subject} and can be contacted at ${teacher.email}.`
  );
};

printTeacherInfo(teacher);


interface Car {
  brand: string;
  year: number;
}


const printCar = (car: Car): string => {
  return `Brand: ${car.brand}, Year: ${car.year}`;
};
const favoriteCar: Car = {
  brand: "Toyota",
  year: 2002,
};

console.log(printCar(favoriteCar));
