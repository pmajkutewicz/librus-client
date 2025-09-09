import logging
from typing import List

from bs4 import BeautifulSoup, ResultSet, Tag

from librus_client.model.notices import Notice


class NoticeParser:
    __logger = logging.getLogger(__name__)
    __soup: BeautifulSoup = None

    def __init__(self, response: str):
        self.__soup = BeautifulSoup(response, 'html.parser')

    def extract_notices(self) -> List[Notice]:
        notices: Tag = self.__soup.find('table', {'class': 'decorated big center'})
        if notices is not None:
            return [self.__parse_notice(n) for n in notices.find('tbody').find_all('tr')]
        else:
            return []

    @staticmethod
    def __parse_notice(notice: Tag) -> Notice:
        columns: ResultSet = notice.find_all('td')
        content = columns[0].text
        date = columns[1].text
        teacher = columns[2].text
        kind = columns[3].text
        category = columns[4].text
        return Notice(date, teacher, kind, category, content)
