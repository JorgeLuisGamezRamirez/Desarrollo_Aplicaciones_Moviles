export class User {
  constructor(id, name, email, role = 'visitante') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

export class Place {
  constructor(id, name, category, municipio, address, description, schedule, code, active = true) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.municipio = municipio;
    this.address = address;
    this.description = description;
    this.schedule = schedule;
    this.code = code;
    this.active = active;
  }
}

export class Visit {
  constructor(id, userId, placeId, date) {
    this.id = id;
    this.userId = userId;
    this.placeId = placeId;
    this.date = date; // Formato YYYY-MM-DD
  }
}

export class Challenge {
  constructor(id, title, description, category, target, startDate, endDate, active = true) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.target = target;
    this.startDate = startDate;
    this.endDate = endDate;
    this.active = active;
  }
}
