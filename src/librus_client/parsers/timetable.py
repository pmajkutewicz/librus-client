import logging
import re
from datetime import date
from itertools import chain
from typing import Dict, Any, List

from bs4 import BeautifulSoup, ResultSet, Tag, PageElement

from librus_client.model.timetable import Timetable


class TimetableParser:
    __logger = logging.getLogger(__name__)
    __soup: BeautifulSoup = None

    def __init__(self, response: str):
        self.__soup = BeautifulSoup(response, 'html.parser')

    def extract_hidden_fields(self) -> Dict[str, Any]:
        return {f['name']: f['value'] for f in self.__soup.find_all('input', {'type': 'hidden'})}

    def extract_year_and_month(self) -> tuple[int, int]:
        selected_month = int(self.__soup.find('select', {'name': 'miesiac'}).find('option', {'selected': 'selected'})['value'])
        selected_year = int(self.__soup.find('select', {'name': 'rok'}).find('option', {'selected': 'selected'})['value'])
        return selected_year, selected_month

    def extract_timetable(self):
        days: ResultSet = self.__soup.find('form').find_all('div', {'class': 'kalendarz-dzien'})
        year, month = self.extract_year_and_month()
        parsed_days = [self.__parse_day(day, month, year) for day in days]  # List of lists, each one contains one day
        return [i for i in chain.from_iterable(parsed_days)]  # flatten list

    def __parse_day(self, day: Tag, month: int, year: int) -> List[Timetable]:
        day_number = int(day.find('div', {'class': 'kalendarz-numer-dnia'}).text)
        current_date = date(year, month, day_number)
        entries = day.find_all('td')
        return [self.__parse_entry(entry, current_date) for entry in entries]

    def __parse_entry(self, entry: Tag, entry_date: date) -> Timetable:
        color = self.__extract_color(entry['style'])
        text = self.__text_cleanup(entry.contents)
        description = self.__description_cleanup(entry['title']) if entry.has_attr('title') else None
        return Timetable(entry_date, color, text, description)

    @staticmethod
    def __text_cleanup(text: List[PageElement]) -> str:
        result = [i.text for i in text if len(i.text) > 0]
        result = [i.replace(',', '').strip() for i in result]
        return '\n'.join(result)

    @staticmethod
    def __description_cleanup(description: str) -> str:
        return description.strip().replace('<br />', '\n')

    @staticmethod
    def __extract_color(style: str) -> str:
        if style.find('#') == -1:
            result = re.search('background-color: rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)', style)  # noqa: W605
            return '#%x%x%x' % (int(result[1]), int(result[2]), int(result[3]))
        else:
            result = re.search('background-color: (#[0-9a-f]{6})', style.lower())  # noqa: E731,E123
            return result[1]
