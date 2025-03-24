# MARTA Station Display

This is a display of incoming arrivals of MARTA Trains.

This is a personal project of George F.

This project is not endorsed or affliated with MARTA in any way.

This project is still under development, and the UI is not yet finalized.

The front end is created with vite and uses React Typescript, deployed using GitHub Pages.

To overcome CORS errors while fetching arrival information from MARTA's publicbly available
train arival information, a backend service is created in go. See [MARTA Train Go API](https://github.com/georgef7/marta-train-go-api) for information on the backend.

Want to run this project locally? An API key is needed. You can [request one from MARTA](https://www.itsmarta.com/developer-reg-rtt.aspx) directly and set up environment variables.
