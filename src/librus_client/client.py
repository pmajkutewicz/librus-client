import json
import logging
import os
from datetime import date
from typing import List

import requests
from dateutil.relativedelta import relativedelta

from librus_client.model.grades import Grade
from librus_client.model.messages import Message
from librus_client.model.notices import Notice
from librus_client.model.timetable import Timetable
from librus_client.parsers.grades import GradeParser
from librus_client.parsers.messages import MessageParser
from librus_client.parsers.notices import NoticeParser
from librus_client.parsers.timetable import TimetableParser


class Client:
    __logger = logging.getLogger(__name__)
    session: requests.Session = requests.Session()

    __url_login = 'https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata'
    __url_login2 = 'https://api.librus.pl/OAuth/Authorization?client_id=46'
    __url_login3 = 'https://api.librus.pl/OAuth/Authorization/2FA?client_id=46'
    __url_timetable = 'https://synergia.librus.pl/terminarz'
    __url_notices = 'https://synergia.librus.pl/uwagi'
    __url_messages0 = 'https://synergia.librus.pl/wiadomosci3'
    __url_messages1 = 'https://wiadomosci.librus.pl/nowy/inbox'
    __url_messages_ids = 'https://wiadomosci.librus.pl/api/inbox/messages?page={}&limit={}'
    __url_messages_content = 'https://wiadomosci.librus.pl/api/inbox/messages/{}'
    __url_grades = 'https://synergia.librus.pl/przegladaj_oceny/uczen'

    __login_payload = {
        'action': 'login',
        'login': os.environ['LIBRUS_LOGIN'],
        'pass': os.environ['LIBRUS_PASS']
    }

    def __init__(self):
        self.session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'})
        a = self.session.get(self.__url_login)
        b = self.session.post(self.__url_login2, data=self.__login_payload)
        c = self.session.get(self.__url_login3)

    def timetable(self) -> List[Timetable]:
        x = self.session.get(self.__url_timetable)
        parser: TimetableParser = TimetableParser(x.text)
        result: List[Timetable] = parser.extract_timetable()
        year, month = parser.extract_year_and_month()
        next_months = self.__generate_next_months(year, month)
        key = parser.extract_hidden_fields()
        for next_month in next_months:
            data = self.session.post(self.__url_timetable, data={'rok': next_month[0], 'miesiac': next_month[1], 'requestkey': key})
            result.extend(TimetableParser(data.text).extract_timetable())
        return result

    def notices(self) -> List[Notice]:
        notices = self.session.get(self.__url_notices)
        parser: NoticeParser = NoticeParser(notices.text)
        result: List[Notice] = parser.extract_notices()
        return result

    def messages(self) -> List[Message]:
        self.session.get(self.__url_messages0)
        self.session.get(self.__url_messages1)
        first_page = self.session.get(self.__url_messages_ids.format(1, 10))
        response = json.loads(first_page.text)
        ids = [x['messageId'] for x in response['data']]
        total = response['total']
        pages = int(total / 10)
        [ids.extend(self.__get_message_page(i)) for i in range(2, pages + 1)]
        return [self.__get_message(id) for id in ids]

    def grades(self) -> List[Grade]:
        grades = self.session.get(self.__url_grades)
        parser: GradeParser = GradeParser(grades.text)
        result: List[Grade] = parser.extract_grades()
        return result

    def __get_message_page(self, page_nb: int) -> List[str]:
        response = json.loads(self.session.get(self.__url_messages_ids.format(page_nb, 10)).text)
        return [x['messageId'] for x in response['data']]

    def __get_message(self, message_id: str) -> Message:
        response = self.session.get(self.__url_messages_content.format(message_id))
        message_json = json.loads(response.text)
        message = message_json['data']
        return MessageParser(message).extract_message()

    @staticmethod
    def __generate_next_months(year: int, month: int) -> List[tuple[int, int]]:
        d = date(year, month, 1)
        plus_1 = d + relativedelta(months=1)
        plus_2 = plus_1 + relativedelta(months=1)
        return [(int(plus_1.year), int(plus_1.month)), (int(plus_2.year), int(plus_2.month))]
