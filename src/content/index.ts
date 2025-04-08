import * as ics from 'ics'
import * as dateFns from 'date-fns' 

type Game = {
    date: string,
    time: string,
    title: string,
    location_name: string,
    location_url: string,
}

function setup() {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                main(observer);
                break;
            }
        }
    });

    main(observer);
}

function main(observer: MutationObserver) {
    observer.disconnect();

    const urlSearchParams = new URLSearchParams(window.location.search);
    if (urlSearchParams.get('view[display]') === 'schedule' && document.querySelector('#regular_season') !== null) {
        const games = parseCalendar();

        if ('error' in games) {
            console.log(games.error);
            return;
        }

        const ical_file = buildICal(games);
        const download_link = URL.createObjectURL(ical_file);
        createDownloadButton(download_link);
    }

    observer.observe(document.body, { childList: true, subtree: true });
}

function buildICal(games: Array<Game>) {
    const events: Array<ics.EventAttributes> = [];
    for (const game of games) {
        const constructed_date = dateFns.parse(`${game.date} ${game.time}`, 'MMMM dd, yyyy h:mm a', new Date());

        events.push({
            start: [constructed_date.getFullYear(), constructed_date.getMonth() + 1, constructed_date.getDate(), constructed_date.getHours(), constructed_date.getMinutes()],
            duration: { hours: 1 },
            title: game.title,
            location: game.location_name,
            url: game.location_url,
        });
    }

    const { error, value } = ics.createEvents(events);
    if (error || typeof value !== 'string') {
        throw error;
    }

    return new File([value], 'calendar.ics', { type: 'text/calendar' })
}

function parseCalendar() {
    const game_containers = document.getElementById('regular_season');

    if (!game_containers) {
        return {'error': 'No games found'};
    }

    const games: Array<Game> = [];
    for (const game_container of game_containers.getElementsByClassName('week-entry')) {
        const date_elements = game_container.getElementsByClassName('game_date')
        if (date_elements.length !== 1) {
            return {'error': 'incorrect number of date elements'};
        }
        const date = date_elements[0].textContent as string;
        
        let team_allocation_entry: Element|null = null;
        const possible_allocation_entries = game_container.getElementsByClassName('allocation-entry');
        for (const possible_allocation_entry of possible_allocation_entries) {
            if (!possible_allocation_entry.checkVisibility()) {
                continue;
            }
        
            team_allocation_entry = possible_allocation_entry;
            break;
        }

        if (!team_allocation_entry) {
            continue;
        }

        const time = team_allocation_entry.getElementsByClassName('game_time')[0].textContent as string;
        const title = team_allocation_entry.getElementsByClassName('match-entry')[0].textContent as string;

        const location_element = team_allocation_entry.getElementsByClassName('facility_details')[0];
        const location_name = location_element.textContent as string;
        const location_url = location_element.getElementsByTagName('a')[0].getAttribute('href') as string;

        games.push({date, time, title, location_name, location_url});
    }

    return games;
}

function createDownloadButton(url: string) {
    const season_section = document.querySelector('#regular_season');
    if (!season_section) {
        return;
    }

    const header = document.querySelector('header');
    if (season_section) {
        console.log("Content script running!");
    }

    const my_button = document.createElement('button');
    my_button.innerText = 'Download Regular Season ICal';
    my_button.classList.add('btn', 'btn-primary', 'mt-2', 'lg:max-w-[680px]');
    my_button.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calendar.ics';
        a.click();
        a.remove();
    };

    my_button.setAttribute('download', 'calendar.ics');
    my_button.setAttribute('href', url);

    header?.after(my_button);
}

setup();
