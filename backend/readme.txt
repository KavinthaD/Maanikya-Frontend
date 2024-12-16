Resources:

frontend localhost port: http://localhost:5173
backend localhost port: http://localhost:8080
Local h2 database Link: http://localhost:8080/h2-console
* username: oop_db
* password: password

How to run cli?

1. On any IDEA open folder "cli" and run main class.
2. Choose whether to load or save configuration
3. Enter all the inputs of configuration
4. Press Enter to start ticket flow
5. Ticket flow will be started and logs of ticket adding and selling will be displayed on IDEA console.

How to run React+Springboot based project?

1. Open  "front-end" folder via Visual Studio Code.
2. Open terminal and run "npm install" and "npm run dev" to run the react web interface on http://localhost:5173
3. Open any IDEA that support spring boot and open "back-end" folder.
4. Run TicketBookingSystemApplication, Folder path is: src/main/java/com/ticketbookingsystem (This will initialize h2 database)
5. From here front-end and back-end is all set upped.
6. On react browser interface enter configuration inputs and submit. (this will be sent to backend and saved on h2 database)
7. Hit "Start System" button on top right corner. (this will start the ticket flow on backend and fetch ticket adding and buying logs to log component on react.
8. After that following details will be displayed on the web interface, 
	- Ticket availability for each vendor  
	- Ticket sales revenue for each vendor
	- Logs of ticket adding and buying
	- display stop button 

Special notes

For a successful connection between the front-end and back-end, ensure the ports being used match those configured in both applications. Ports are motioned in multiple locations in the project.