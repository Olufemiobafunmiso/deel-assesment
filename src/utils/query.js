exports.queries = {
best_clients_query: "SELECT j.id, j.price, j.paid, j.paymentDate, j.createdAt, c.ClientId, p.firstName, p.lastName, SUM(j.price) as totalPricePaid from Jobs as j join Contracts as c on j.ContractId = c.id JOIN Profiles AS p ON c.ClientId = p.id where j.paid = 1 and paymentDate BETWEEN ? AND ? GROUP BY c.ClientId ORDER BY ClientId ASC, totalPricePaid DESC LIMIT ?",
best_professions_query: "SELECT p.profession, SUM(j.price) AS total_amount_earned FROM Jobs AS j JOIN Contracts AS c ON j.ContractId = c.id JOIN Profiles AS p ON c.ContractorId = p.id WHERE j.paid = 1 AND paymentDate BETWEEN ? AND ? GROUP BY p.profession ORDER BY total_amount_earned DESC"
}






