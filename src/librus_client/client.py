import logging
import os
from datetime import date
from typing import List

import requests
from dateutil.relativedelta import relativedelta

from librus_client.model.notices import Notice
from librus_client.model.timetable import Timetable
from librus_client.parsers.notices import NoticeParser
from librus_client.parsers.timetable import TimetableParser


class Client:
    __logger = logging.getLogger(__name__)
    __session: requests.Session = requests.Session()

    __url_login = 'https://api.librus.pl/OAuth/Authorization?client_id=46&response_type=code&scope=mydata'
    __url_login2 = 'https://api.librus.pl/OAuth/Authorization?client_id=46'
    __url_login3 = 'https://api.librus.pl/OAuth/Authorization/2FA?client_id=46'
    __url_timetable = 'https://synergia.librus.pl/terminarz'
    __url_notices = 'https://synergia.librus.pl/uwagi'

    __login_payload = {
        'action': 'login',
        'login': os.environ['LIBRUS_LOGIN'],
        'pass': os.environ['LIBRUS_PASS']
    }

    def __init__(self):
        self.__session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'})
        self.__session.get(self.__url_login)
        self.__session.post(self.__url_login2, data=self.__login_payload)
        self.__session.get(self.__url_login3)

    def timetable(self) -> List[Timetable]:
        x = self.__session.get(self.__url_timetable)
        parser: TimetableParser = TimetableParser(x.text)
        result: List[Timetable] = parser.extract_timetable()
        year, month = parser.extract_year_and_month()
        next_months = self.__generate_next_months(year, month)
        key = parser.extract_hidden_fields()
        for next_month in next_months:
            data = self.__session.post(self.__url_timetable, data={'rok': next_month[0], 'miesiac': next_month[1], 'requestkey': key})
            result.extend(TimetableParser(data.text).extract_timetable())
        return result

    def notices(self) -> List[Notice]:
        notices = self.__session.get(self.__url_notices)
        parser: NoticeParser = NoticeParser(notices.text)
        result: List[Notice] = parser.extract_notices()
        return result

    @staticmethod
    def __generate_next_months(year: int, month: int) -> List[tuple[int, int]]:
        d = date(year, month, 1)
        plus_1 = d + relativedelta(months=1)
        plus_2 = plus_1 + relativedelta(months=1)
        return [(int(plus_1.year), int(plus_1.month)), (int(plus_2.year), int(plus_2.month))]
