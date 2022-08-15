1. clone repo to your local
2. goto cloned folder
3. run "npm install"
4. run "npm start"

used react-18.XX


ASSUMPTIONS TAKEN - 

1. As I did not understand what "nearest across all batches means, I showing minimum  expiry date
2. If there are two batches same name , As per problem state we are not aggregating them. As  that won't be right I aggreagted records with same batch name. (it is necessary as we are using dropdown for batchname , we cannot have duplicate values)


SITE NAVIGATION

1. "/" - upload csv file
2. after submit it redirects to "/dataTable" . you can check required data
3. click on view charts, it will redirect to "/charts
4. select company name and click generate pie chart - it will show pie chart
5.  select company name and date, thenclick generate bar chart - it will show bar chart
6. any other route will redirect to 404 page
7. on page refresh it will go to file input page (as it is only frontend)



using React 18 - known bugs in react 18 - https://www.techiediaries.com/react-18-useeffect/