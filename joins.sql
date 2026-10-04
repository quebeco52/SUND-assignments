
-- 1.
-- facid is a foreign key pointing to cd.facilities.
-- memid is a foreign key referencing cd.members.
--
-- 2. 
-- Many-to-many between members and facilities.
-- The cd.bookings.
--
-- 3.
-- It is a recursive relationship.


-- 1.
SELECT bks.starttime
FROM cd.bookings bks
JOIN cd.members mems ON mems.memid = bks.memid
WHERE mems.firstname = 'David' AND mems.surname = 'Farrell';


-- 2.
SELECT bks.starttime AS start, facs.name AS name
FROM cd.facilities facs
JOIN cd.bookings bks ON facs.facid = bks.facid
WHERE facs.name IN ('Tennis Court 2', 'Tennis Court 1')
  AND bks.starttime >= '2012-09-21'
  AND bks.starttime < '2012-09-22'
ORDER BY bks.starttime;

-- 3.
SELECT DISTINCT recs.firstname AS firstname, recs.surname AS surname
FROM cd.members mems
JOIN cd.members recs ON recs.memid = mems.recommendedby
ORDER BY surname, firstname;


-- 4.
SELECT mems.firstname AS memfname, 
       mems.surname AS memsname, 
       recs.firstname AS recfname, 
       recs.surname AS recsname
FROM cd.members mems
LEFT OUTER JOIN cd.members recs ON recs.memid = mems.recommendedby
ORDER BY memsname, memfname;

-- 5.
SELECT DISTINCT mems.firstname || ' ' || mems.surname AS member, 
       facs.name AS facility
FROM cd.members mems
JOIN cd.bookings bks ON mems.memid = bks.memid
JOIN cd.facilities facs ON bks.facid = facs.facid
WHERE facs.name IN ('Tennis Court 2', 'Tennis Court 1')
ORDER BY member, facility;


-- 6.
SELECT mems.firstname || ' ' || mems.surname AS member, 
       facs.name AS facility, 
       CASE 
           WHEN mems.memid = 0 THEN bks.slots * facs.guestcost
           ELSE bks.slots * facs.membercost
       END AS cost
FROM cd.members mems                
JOIN cd.bookings bks ON mems.memid = bks.memid
JOIN cd.facilities facs ON bks.facid = facs.facid
WHERE bks.starttime >= '2012-09-14' 
  AND bks.starttime < '2012-09-15' 
  AND (
      (mems.memid = 0 AND bks.slots * facs.guestcost > 30) OR
      (mems.memid != 0 AND bks.slots * facs.membercost > 30)
  )
ORDER BY cost DESC;


-- 7.
SELECT DISTINCT mems.firstname || ' ' || mems.surname AS member,
       (SELECT recs.firstname || ' ' || recs.surname AS recommender 
        FROM cd.members recs 
        WHERE recs.memid = mems.recommendedby
       )
FROM cd.members mems
ORDER BY member;

-- 8.
SELECT member, facility, cost 
FROM (
    SELECT mems.firstname || ' ' || mems.surname AS member,
           facs.name AS facility,
           CASE
               WHEN mems.memid = 0 THEN bks.slots * facs.guestcost
               ELSE bks.slots * facs.membercost
           END AS cost
    FROM cd.members mems
    JOIN cd.bookings bks ON mems.memid = bks.memid
    JOIN cd.facilities facs ON bks.facid = facs.facid
    WHERE bks.starttime >= '2012-09-14'
      AND bks.starttime < '2012-09-15'
) AS bookings
WHERE cost > 30
ORDER BY cost DESC;
