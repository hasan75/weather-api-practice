const searchWeather = async () => {
	const searchInputField = document.getElementById('search_input');
	const searchText = searchInputField.value;
	searchInputField.value = '';

	if (searchText == '') {
		displayErrorNotice('Please type something to search.');
	} else {
		document.getElementById('error_notice').textContent = '';
		document.getElementById('weather_info').textContent = '';
		const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=0c4ef1b4f6592cb29a883e80055fa44a&units=metric`;
		try {
			const res = await fetch(url);
			const data = await res.json();
			showWeatherDetails(data);
		} catch (err) {
			displayErrorNotice();
			console.log(err);
		}
	}
};

// trigger search on pressing the Enter key
document.getElementById('search_input').addEventListener('keyup', function (e) {
	let key = e.key || e.code || e.keyCode;
	if (key === 'Enter' || key === 13) {
		e.preventDefault();
		searchWeather();
	}
});

// display error notice
const displayErrorNotice = (errorMessage = 'Something went wrong. Try again later.') => {
	document.getElementById('error_notice').innerHTML = `
		<h5 class="text-danger my-4">${errorMessage}</h5>
	`;
};

// show weather details
const showWeatherDetails = location => {
	console.log(location);
	// const currentDate = new Date().toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
	const localDate = convertUnixTimeToLocal(location.dt);
	const sunriseTime = convertUnixTimeToLocal(location.sys.sunrise);
	const sunsetTime = convertUnixTimeToLocal(location.sys.sunset);
	document.getElementById('weather_info').innerHTML = `
		<div class="main-info">
			<h3 class="location d-flex justify-content-center text-start fw-normal mb-0">
				<span class="icon me-2"><img src="./images/location.svg" alt="Location"></span>
				<span>${location.name}, ${location.sys.country} <span class="date d-block mt-1">${localDate.fullDate}</span></span>
			</h3>
			<div class="status-image">
				<img src="http://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png" alt="Weather icon">
			</div>
			<h2 class="temperature d-flex align-items-center justify-content-center">
				<span class="icon"><img src="./images/thermometer.svg" alt="Thermometer"></span>
				<span>${location.main.temp}</span>&deg;C</h2>
			<p class="weather-type">${location.weather[0].main} <i>(${location.weather[0].description})</i></p>
		</div>
		<div class="extra-info pt-3 overflow-hidden">
			<p class="feels-like px-3  border-end">Feels like <b>38.74</b>&deg;C</p>
			<p class="humidity px-3 ">Humidity <b>${location.main.feels_like}&percnt;</b></p>
			<div class="px-3 d-flex justify-content-center align-items-center mt-4">
				<div class="sunrise pe-4">
					<p class="label mb-2">
						<img src="./images/sunrise.svg" alt="Sunrise" class="me-2">
						Sunrise
					</p>
					<b>${sunriseTime.time12h}</b>
				</div>
				<div class="sunset ps-4">
					<p class="label mb-2">
						<img src="./images/sunset.svg" alt="Sunset" class="me-2">
						Sunset
					</p>
					<b>${sunsetTime.time12h}</b>
				</div>
			</div>
			<small class="data-notice p-2 d-block text-success bg-light mt-3">All data is based on your local time zone.</small>
		</div>
	`;
};

// convert unix time to local format
const convertUnixTimeToLocal = unixTime => {
	const milliSeconds = unixTime * 1000;
	const humanDateFormat = new Date(milliSeconds);
	const convertedTimeObject = {
		fullDate: humanDateFormat.toLocaleString('en-US', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}),
		time12h: humanDateFormat.toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true,
		}),
	};
	return convertedTimeObject;
};
