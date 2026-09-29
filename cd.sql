-- retriving all from cd.facilities
select * from cd.facilities;

-- retriving names and membercosts from cd.facilities
select name, membercost from cd.facilities; 

-- retriving all from cd.facilities that cost
select * from cd.facilities where membercost > 0;

-- retriving names and membercosts from cd.facilities that cost more than the monthly maintenance divided by 50
select facid, name, membercost, monthlymaintenance 
	from cd.facilities 
	where 
		membercost > 0 and 
		(membercost < monthlymaintenance/50.0);

-- retriving all facilities with the word Tennis
select *
	from cd.facilities 
	where 
		name like '%Tennis%';

-- retriving cd.facilities with facid 1 and 5
select * 
	from cd.facilities 
	where 
		facid in (1,5);

-- listing facilities maintenance monthly cost
select name, 
	case when (monthlymaintenance > 100) then
		'expensive'
	else
		'cheap'
	end as cost
	from cd.facilities;

-- retriving members who joined after after September 2012
select memid, surname, firstname, joindate 
	from cd.members
	where joindate >= '2012-09-01'; 

-- list of the first 10 surnames
select distinct surname 
	from cd.members
order by surname
limit 10;

-- retriving all the last names from cd.members and all names from cd.facilities
select surname 
	from cd.members
union
select name
	from cd.facilities;

-- retriving latest join date from cd.members
select max(joindate) as latest
	from cd.members; 

-- get first and last name of members who joined on the latest date
select firstname, surname, joindate
	from cd.members
	where joindate = 
		(select max(joindate) 
			from cd.members); 