export class TextValidator{
  constructor(){
    this.validator = [];
  }
  addValidator(newValidator){
    this.validator.push(newValidator);
    return this;
  }

  validate(text){
    let response = true;
    const errors = [];
    this.validator.forEach(element => {
      const isValid = element.validate(text);
      response = response && isValid;
      if (!isValid){
        errors.push(element.message);
      }
    });
    const error = (errors.length===0) ? "":errors[0];
    return { isValid:response, error };
  }
};

export class NotIsVoid{
  constructor(){
    this.message = "El campo no puede estar vacío";
  }
  validate(text=""){
    const textL = text.trim().length;
    return textL !== 0;
  }
};

export class HaveBetweenLength{
  constructor(min=0, max=0){
    this.max = max;
    this.min = min;
    this.message = `el campo debe estar entre los valores ${ min } y ${ max }`;
  }

  validate(text=""){
    const textL = text.trim().length;
    return textL >= this.min && textL <= this.max;
  }
}

export class DateIsNotBeforeNow{
  constructor() {
    this.message = "La fecha no puede ser antes de la actual";
  };

  validate(date){
    const formatedDate = new Date(date);
    const isValid = new Date() < formatedDate;
    return isValid;
  }
}

export class StartDateIsBeforeEndDate{
  constructor(startDate, endDate){
    this.start = new Date(startDate);
    this.end = new Date(endDate);
    this.message = "La fecha de inicio no puede estar después de la fecha fin";
  }
  validate(){
    const isValid = this.start<this.end;
    return isValid;
  }
};

export class DateIsNotBeforeOf{
  constructor(date){
    this.date = new Date(date);
    this.message = "La fecha ingresada no puede ser inferior a la fecha Inicio";
  }
  validate(date){
    const isValid = new Date(date)>this.date;
    return isValid;
  }
};

export class DateIsNotAfterOf{
  constructor(date){
    this.date = new Date(date);
    this.message = "La fecha ingresada no puede ser despues de la fecha fin";
  }
  validate(date){
    const isValid = new Date(date)<this.date;
    return isValid;
  }
};

