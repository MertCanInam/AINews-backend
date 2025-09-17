const userRepository = require("../../repositories/userRepository");
const postRepository = require("../../repositories/postsRepository");
const sourceRepository = require("../../repositories/sourcesRepository");
const ticketRepository = require("../../repositories/ticketRepository");
const savedPostsRepository = require("../../repositories/savedPostsRepository");

async function getDashboardStats() {
  // 1. Genel sayılar
  const totalUsers = await userRepository.countUsers();
  const totalPosts = await postRepository.countPosts();
  const totalSources = await sourceRepository.countSources();
  const totalTickets = await ticketRepository.countTickets();

  // 2. Ticket durum dağılımı
  const ticketStatusRaw = await ticketRepository.countTicketsByStatus();
  const ticketStatus = ticketStatusRaw.reduce((acc, row) => {
    acc[row.status] = parseInt(row.get("count"));
    return acc;
  }, { open: 0, read: 0, closed: 0 });

  // 3. En çok beğenilen haberler (top 5)
  const topLikedPosts = await savedPostsRepository.getTopLikedPosts(5);

  // 4. Son haber çekme zamanı
  const lastPostDate = await postRepository.getLastPostDate();

  return {
    totalUsers,
    totalPosts,
    totalSources,
    totalTickets,
    ticketStatus,
    topLikedPosts,
    lastPostDate,
  };
}

module.exports = { getDashboardStats };
