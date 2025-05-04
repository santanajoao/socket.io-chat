export class DateFormatter {
  static formatBrazilianDateTime(dateString: string) {
    const date = new Date(dateString);
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  static formatBrazilianTime(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  static formatBrazilianDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
