import logging
import re
from datetime import date
from itertools import chain
from typing import Dict, Any, List

from bs4 import BeautifulSoup, ResultSet, Tag

from librus_client.model.timetable.category import Category
from librus_client.model.timetable.timetable import Timetable


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
        detected_category = self.__extract_category(entry['style'])
        match detected_category:
            case Category.ABSENCE:
                teacher = self.__parse_absence_data(entry.text)
                return Timetable.absence(entry_date, teacher)
            case Category.SUBSTITUTION:
                new_category, teacher, lesson_number, lesson_name = self.__parse_substitution_data(entry.text)
                return Timetable.substitution_cancellation(entry_date, new_category, teacher, lesson_number, lesson_name)
            case Category.QUIZ:
                lesson_number, lesson_name, group = self.__parse_quiz_data(entry.text)
                return Timetable.quiz_oral_optional_reading_test(entry_date, detected_category, lesson_number, lesson_name, group)
            case Category.ORAL_RESPONSE:
                lesson_number, lesson_name, group = self.__parse_oral_data(entry.text)
                return Timetable.quiz_oral_optional_reading_test(entry_date, detected_category, lesson_number, lesson_name, group)
            case Category.OPTIONAL_TASK:
                lesson_number, lesson_name, group = self.__parse_optional_task_data(entry.text)
                return Timetable.quiz_oral_optional_reading_test(entry_date, detected_category, lesson_number, lesson_name, group)
            case Category.READING:
                lesson_number, lesson_name, group = self.__parse_reading_data(entry.text)
                return Timetable.quiz_oral_optional_reading_test(entry_date, detected_category, lesson_number, lesson_name, group)
            case Category.TEST:
                lesson_number, lesson_name, group = self.__parse_test_data(entry.text)
                return Timetable.quiz_oral_optional_reading_test(entry_date, detected_category, lesson_number, lesson_name, group)
            case Category.PARENTS_MEETING:
                hour, group, room, description = self.__parse_parentsmeeting_data(entry)
                return Timetable.parent_meeting(entry_date, hour, group, room, description)
            case Category.COMPETITION:
                lesson_number, lesson_name, group, description = self.__parse_competition(entry)
                return Timetable.competition(entry_date, lesson_number, lesson_name, group, description)
            case Category.SUMMARY:
                lesson_number, lesson_name, group, description = self.__parse_summary_data(entry)
                return Timetable.summary(entry_date, lesson_number, lesson_name, group, description)
            case _:
                return Timetable(entry_date, detected_category, entry.text, None, "SOMETHING WENT WRONG :)", None, None, None)

    def __extract_category(self, style: str) -> Category:
        if style.find('#') == -1:
            result = re.search('background-color: rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)', style)  # noqa: W605
            return Category((int(result[1]), int(result[2]), int(result[3])))
        else:
            result = re.search('background-color: #([0-9a-f]{6})', style.lower())  # noqa: E731,E123
            return Category(self.__hex_to_rgb(result[1]))

    @staticmethod
    def __parse_absence_data(text: str):
        result = re.search('Nieobecność:Nauczyciel: (.+)', text)
        return result[1] if result is not None else text

    @staticmethod
    def __parse_substitution_data(text: str) -> tuple[Category, str, int, str]:
        if text.find('Zastępstwo') > 0:
            result = re.search("Zastępstwo z (.+) na lekcji nr: (\d) \((.+)\)", text)  # noqa: W605
            return Category.SUBSTITUTION, result[1], int(result[2]), result[3]
        else:
            result = re.search("Odwołane zajęcia(.+) na lekcji nr: (\d) \((.+)\)", text)  # noqa: W605
            return Category.CANCELLED, result[1], int(result[2]), result[3]

    @staticmethod
    def __parse_quiz_data(text: str) -> tuple[int, str, str]:
        result = re.search('Nr lekcji: (\d+)(.+), Kartkówka(.+)', text)  # noqa: W605
        return int(result[1]), result[2], result[3]

    @staticmethod
    def __parse_oral_data(text: str) -> tuple[int, str, str]:
        result = re.search('Nr lekcji: (\d+)(.+), Odpowiedź ustna(.+)', text)  # noqa: W605
        return int(result[1]), result[2], result[3]

    @staticmethod
    def __parse_optional_task_data(text: str) -> tuple[int, str, str]:
        result = re.search('Nr lekcji: (\d+)(.+), Zadanie nieobowiązkowe(.+)', text)  # noqa: W605
        return int(result[1]), result[2], result[3]

    @staticmethod
    def __parse_reading_data(text: str) -> tuple[int, str, str]:
        result = re.search('Nr lekcji: (\d+)(.+), Lektura(.+)', text)  # noqa: W605
        return int(result[1]), result[2], result[3]

    @staticmethod
    def __parse_test_data(text: str) -> tuple[int, str, str]:
        result = re.search('Nr lekcji: (\d+)(.+), Sprawdzian(.+)', text)  # noqa: W605
        return int(result[1]), result[2], result[3]

    @staticmethod
    def __parse_parentsmeeting_data(entry: Tag) -> tuple[str, str, str, str]:
        result = re.search('Wywiadówka: Zebranie Rodzicówgodz.:.([0-9]+):([0-9]{2})(.+)Sala:(.+)', entry.text)
        description = entry['title'].replace('<br />', '\n')
        return f'{result[1]}:{result[2]}', result[3], result[4].strip(), description

    @staticmethod
    def __parse_summary_data(entry: Tag) -> tuple[int, str, str, str]:
        result = re.search('Nr lekcji: ([0-9])(.+), Podsumowanie dzisiejszej pracy(.+)', entry.text)
        description = entry['title'].replace('<br />', '\n')
        return int(result[1]), result[2], result[3], description

    @staticmethod
    def __parse_competition(entry: Tag) -> tuple[int, str, str, str]:
        result = re.search('Nr lekcji: ([0-9])(.+), Konkurs(.+)', entry.text)
        description = entry['title'].replace('<br />', '\n')
        return int(result[1]), result[2], result[3], description

    @staticmethod
    def __hex_to_rgb(hex_value: str):
        # https://stackoverflow.com/a/29643643/1156739
        return tuple(int(hex_value[i:i + 2], 16) for i in (0, 2, 4))
