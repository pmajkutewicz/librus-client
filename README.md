# EN

## About

Library to fetch and parse librus pages - cause they don't want to share their API.

## Current state

I need all information from timetable - in order to automate few things. So this is my priority. After that I'll think about other data that I can fetch.

### Timetable

Example code for getting all entries (this month and next two) from timetable, with enabled http requests debugging
You have to pass 2 envs:
- LIBRUS_LOGIN (login do librusa)
- LIBRUS_PASS (hasło)

```python
import logging
import http.client

from client import Client

http.client.HTTPConnection.debuglevel = 1
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
req_log = logging.getLogger('requests.packages.urllib3')
req_log.setLevel(logging.DEBUG)
req_log.propagate = True

client: Client = Client()
a = client.terminarz()
print(a)
```

### Notices

Example code for fetching student notices.
You have to pass 2 envs:
- LIBRUS_LOGIN (login do librusa)
- LIBRUS_PASS (hasło)

```python
from client import Client

client: Client = Client()
a = client.notices()
print(a)
```

### Messages

Example code for fetching messages.
You have to pass 2 envs:
- LIBRUS_LOGIN (login do librusa)
- LIBRUS_PASS (hasło)

```python
from client import Client

client: Client = Client()
a = client.messages()
print(a)
```

### Grades

Example code for fetching grades.
You have to pass 2 envs:
- LIBRUS_LOGIN (login do librusa)
- LIBRUS_PASS (hasło)

```python
from client import Client

client: Client = Client()
a = client.grades()
print(a)
```

## Credentials

- Big thanks to https://github.com/Mati365/librus-api - I've used checked his log in solution.

# PL

## O projekcie

Biblioteka parsująca to co zwraca librus. Niestety Librus nie udostępnia API, a ja chciałbym sobie zintegrować librusa z HA czy też kilka rzeczy zautomatyzować.

## Aktualny stan

"Na wczoraj" potrzebuję wyciągać dane z terminarza. I to jest robione w pierwszej kolejności. Staram się wyciągnąć każdą możliwą informację z tego, co zwraca librus w terminarzu.

### Terminarz

Przykładowy kod pobierający terminarz (ten i dwa następne miesiące) wraz włączonym debugowanie zapytań HTTP
Wymaga podania 2 zmiennych środowiskowych:
- LIBRUS_LOGIN (login do librusa)
- LIBRUS_PASS (hasło)

```python
import logging
import http.client

from client import Client

http.client.HTTPConnection.debuglevel = 1
logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)
req_log = logging.getLogger('requests.packages.urllib3')
req_log.setLevel(logging.DEBUG)
req_log.propagate = True

client: Client = Client()
a = client.timetable()
print(a)
```

### Uwagi

Przykładowy kod pobierający uwagi ucznia.
Wymaga podania 2 zmiennych środowiskowych:
- LIBRUS_LOGIN (login do librusa)
- LIBRUS_PASS (hasło)

```python
from client import Client
client: Client = Client()
a = client.notices()
print(a)
```

### Wiadomości

Przykładowy kod pobierający wiadomości.
Wymaga podania 2 zmiennych środowiskowych:
- LIBRUS_LOGIN (login do librusa)
- LIBRUS_PASS (hasło)

```python
from client import Client
client: Client = Client()
a = client.messages()
print(a)
```

### Oceny

Przykładowy kod pobierający oceny.
Wymaga podania 2 zmiennych środowiskowych:
- LIBRUS_LOGIN (login do librusa)
- LIBRUS_PASS (hasło)

```python
from client import Client
client: Client = Client()
a = client.grades()
print(a)
```

## Podziękowania

- Dla https://github.com/Mati365/librus-api - dzięki niemu szybciej ogarnąłem logowanie.