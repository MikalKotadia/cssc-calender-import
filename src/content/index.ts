import * as ics from 'ics'

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
        createDownloadButton();
        parseCalendar();
    }

    observer.observe(document.body, { childList: true, subtree: true });
}

function parseCalendar() {
    const game_containers = document.getElementById('regular_season');

    if (!game_containers) {
        return {'error': 'No games found'};
    }

    for (const game_container of game_containers.getElementsByClassName('week-entry')) {
        const date_elements = game_container.getElementsByClassName('game_date')
        if (date_elements.length !== 1) {
            return {'error': 'incorrect number of date elements'};
        }
        const date_element = date_elements[0]
        
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

        console.log(date_element.textContent);
        console.log(team_allocation_entry);
    }
}

function createDownloadButton() {
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

    header?.after(my_button);
}

setup();
