## DESIGN MODEL AND LAYOUT ADR
## CONTEXT:
Good development practices require Separation of Concerns (SoCs) to enable the development of 
robust code
## PROBLEM:
Source code can become unreadable, long, and difficult to edit - making testing and maintenance 
difficult
## SOLUTION:
The Model-View-Controllers (M-V-C) architecture pattern is followed 
- Model refers to the files that are under scripts folder
- View refers to files that are under css and views folders 
- Controllers refers to The Back End which has utils, wordlist and index files that control the commands in the front end
- Repositories abstracts SQL server database access commands
- Routes utilises services to fetch information required by API calls for client