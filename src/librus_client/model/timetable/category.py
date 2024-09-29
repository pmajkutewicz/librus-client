from enum import Enum


class Category(Enum):
    ABSENCE = (255, 120, 120)  # nieobecność
    SUBSTITUTION = (106, 150, 4)  # zastępstwo
    PARENTS_MEETING = (171, 205, 239)  # wywiadówka
    ORAL_RESPONSE = (255, 215, 0)  # odpowiedź ustna
    QUIZ = (51, 51, 255)  # kartkówka
    OPTIONAL_TASK = (50, 205, 50)  # zadanie nieobowiązkowe
    READING = (189, 183, 107)  # lektura
    TEST = (255, 0, 0)  # sprawdzian
    SUMMARY = (169, 169, 169)  # summary
    COMPETITION = (218, 165, 32)  # konkurs
    CANCELLED = (0, 0, 0)  # odwołane
