export abstract class Identifiable {
  public identifier: string;
  public name: string;
  public description: string;

  constructor(
    identifiableOrIdentifier: Identifiable | string,
    name?: string,
    description?: string,
  ) {
    if (typeof identifiableOrIdentifier === 'string') {
      this.identifier = identifiableOrIdentifier;
      this.name = name;
      this.description = description;
    } else {
      this.identifier = identifiableOrIdentifier.identifier;
      this.name = identifiableOrIdentifier.name;
      this.description = identifiableOrIdentifier.description;
    }
  }

  static create(nodeInstanceIdentifier: string) {
    return new Identifier(nodeInstanceIdentifier);
  }
}

class Identifier extends Identifiable {
  constructor(id: string) {
    super(id, '', '');
  }
}
