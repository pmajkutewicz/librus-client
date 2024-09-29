import datetime
from dataclasses import dataclass
from typing import Optional

from librus_client.model.timetable.category import Category
import hashlib

@dataclass
class Timetable:
    """Timetable entry"""
    date: datetime.date
    category: Category
    teacher: str
    lesson_number: int
    lesson_name: str
    group: str
    hour: str
    room: str
    text: str

    def __init__(self, date: datetime.date, category: Category, teacher: Optional[str],
                 lesson_number: Optional[int], lesson_name: Optional[str], group: Optional[str], hour: Optional[str], room: Optional[str], text: Optional[str]):
        self.date = date
        self.category = category
        self.teacher = teacher
        self.lesson_number = lesson_number
        self.lesson_name = lesson_name
        self.group = group
        self.hour = hour
        self.room = room
        self.text = text

    def __str__(self):
        match self.category:
            case Category.ABSENCE:
                return f'Nieobecność: Nauczyciel: {self.teacher}'
            case Category.SUBSTITUTION:
                return f'Zastępstwo z {self.teacher} na lekcji nr: {self.lesson_number} ({self.lesson_name})'
            case Category.READING:
                return 'Lektura'
            case Category.QUIZ:
                return f'Kartkówka z {self.lesson_name}'
            case Category.TEST:
                return f'Sprawdzian z {self.lesson_name}'
            case Category.OPTIONAL_TASK:
                return f'Zadanie nieobowiązkowe z {self.lesson_name}'
            case Category.PARENTS_MEETING:
                return f'Wywiadówka o {self.hour}'
            case Category.CANCELLED:
                return f'Lekcje odwołane z {self.teacher} na lekcji nr: {self.lesson_number} ({self.lesson_name})'
            case Category.SUMMARY:
                return f'Podsumowanie z {self.lesson_name} na lekcji nr. {self.lesson_number}: {self.text}'
            case Category.COMPETITION:
                return f'Konkurs z {self.lesson_name} na lekcji nr. {self.lesson_number}: {self.text}'

    def __hash__(self) -> str:
        a_date = '' if self.date is None else str(self.date)
        a_category = '' if self.category is None else self.category
        a_teacher = '' if self.teacher is None else self.teacher
        a_lesson_number = '' if self.lesson_number is None else str(self.lesson_number)
        a_lesson_name = '' if self.lesson_name is None else self.lesson_name
        a_group = '' if self.group is None else self.group
        a_hour = '' if self.hour is None else self.hour
        a_room = '' if self.room is None else self.room
        all = f'{a_date}-{a_category}-{a_teacher}-{a_lesson_number}-{a_lesson_name}-{a_group}-{a_hour}-{a_room}'
        return hashlib.md5(all.encode('utf-8')).hexdigest()

    @classmethod
    def absence(cls, date: datetime.date, teacher: str):
        return cls(date, Category.ABSENCE, teacher, None, None, None, None, None, None)

    @classmethod
    def substitution_cancellation(cls, date: datetime.date, category: Category, teacher: str, lesson_number: int, lesson_name: str):
        return cls(date, category, teacher, lesson_number, lesson_name, None, None, None, None)

    @classmethod
    def quiz_oral_optional_reading_test(cls, date: datetime.date, category: Category, lesson_number: int, lesson_name: str, group: str):
        return cls(date, category, None, lesson_number, lesson_name, group, None, None, None)

    @classmethod
    def parent_meeting(cls, date: datetime.date, hour: str, group: str, room: str, text: str):
        return cls(date, Category.PARENTS_MEETING, None, None, None, group, hour, room, text)

    @classmethod
    def summary(cls, date: datetime.date, lesson_number: int, lesson_name: str, group: str, text: str):
        return cls(date, Category.SUMMARY, None, lesson_number, lesson_name, group, None, None, text)

    @classmethod
    def competition(cls, date: datetime.date, lesson_number: int, lesson_name: str, group: str, text: str):
        return cls(date, Category.COMPETITION, None, lesson_number, lesson_name, group, None, None, text)