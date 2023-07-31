meu comando de addponto é esse : 

const Discord = require(`discord.js`);
const Points = require("../../database/models/Points.js");

module.exports = {
  name: "addpontos",
  description: "Adiciona pontos.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "quantidade",
      description: "Quantidade de pontos a serem adicionados",
      type: Discord.ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const quantidade = interaction.options.getInteger("quantidade");
    const userId = interaction.user.id;

    try {
      const currentWeek = getCurrentWeek();
      const currentDate = getCurrentDate();

      let userPointsWeek = await Points.findOne({ userId: userId, week: currentWeek });
      let userPointsTotal = await Points.findOne({ userId: userId });

      if (!userPointsWeek) {
        userPointsWeek = await Points.create({ userId: userId, week: currentWeek, lastUsed: currentDate });
      }

      if (!userPointsTotal) {
        userPointsTotal = await Points.create({ userId: userId });
      }

      userPointsWeek.weeklyPoints += quantidade;
      userPointsTotal.totalPoints += quantidade;
      userPointsWeek.dailyPoints += quantidade;

      // Atualiza a data do último uso para a data atual
      userPointsWeek.lastUsed = currentDate;

      await userPointsWeek.save();
      await userPointsTotal.save();

      return interaction.reply({
        content: `Foram adicionados ${quantidade} pontos.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Erro ao atualizar a pontuação:", error);
      return interaction.reply({
        content: "Ocorreu um erro ao executar o comando.",
        ephemeral: true,
      });
    }
  },
};

// Restante do código igual

// Função auxiliar para obter o número da semana atual
function getCurrentWeek() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now - startOfYear) / (24 * 60 * 60 * 1000) + startOfYear.getDay() + 1) / 7);
  return weekNumber;
}

// Função auxiliar para obter a data atual (ignorando a hora)
function getCurrentDate() {
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return currentDate;
}


meu comando de vr os pontos é esse:
const Discord = require("discord.js");
const Points = require("../../database/models/Points.js");

module.exports = {
  name: "meuspontos",
  description: "Verifica seus pontos acumulados na soma semanal, diária e o total de todos os tempos.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "membro",
      description: "Membro para ver os pontos (opcional)",
      type: Discord.ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  run: async (client, interaction) => {
    const memberParam = interaction.options.getUser("membro");
    const userId = memberParam ? memberParam.id : interaction.user.id;

    try {
      const currentWeek = getCurrentWeek();
      const currentDate = getCurrentDate();

      let userPointsWeek = await Points.findOne({ userId: userId, week: currentWeek });
      let userPointsTotal = await Points.findOne({ userId: userId });

      if (!userPointsWeek) {
        userPointsWeek = await Points.create({ userId: userId, week: currentWeek, lastUsed: currentDate });
      }

      if (!userPointsTotal) {
        userPointsTotal = await Points.create({ userId: userId });
      }

      const member = memberParam || interaction.user;
      const pointsEmbed = new Discord.EmbedBuilder()
        .setTitle("Pontuação")
        .setDescription(`Pontos acumulados de ${member.tag}`)
        .setColor("#0099ff")
        .addFields(
          { name: `Pontos semanais`, value: userPointsWeek.weeklyPoints.toString() },
          { name: `Pontos diários`, value: userPointsWeek.dailyPoints.toString() },
          { name: `Pontos totais`, value: userPointsTotal.totalPoints.toString() }
        );

      return interaction.reply({ embeds: [pointsEmbed], ephemeral: true });
    } catch (error) {
      console.error("Erro ao obter os pontos do usuário:", error);
      return interaction.reply({
        content: "Ocorreu um erro ao executar o comando.",
        ephemeral: true,
      });
    }
  },
};

// Restante do código igual

// Função auxiliar para obter o número da semana atual
function getCurrentWeek() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now - startOfYear) / (24 * 60 * 60 * 1000) + startOfYear.getDay() + 1) / 7);
  return weekNumber;
}

// Função auxiliar para obter a data atual (ignorando a hora)
function getCurrentDate() {
  const now = new Date();
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return currentDate;
}


esse é meu schema chamado points.js:
const mongoose = require("mongoose");

const pointsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  week: { type: Number, required: true },
  lastUsed: { type: Date, default: Date.now() },
  totalPoints: { type: Number, default: 0 },
  weeklyPoints: { type: Number, default: 0 },
  dailyPoints: { type: Number, default: 0 },
});

module.exports = mongoose.model("Points", pointsSchema);


.......................

o objetivo desse sistema todo é, todo dia cada membro mandar quantos pontos fez por dia, sendo assim, sera adicionado a quantidade do dia, da semana e do total. os pontos do dia deve sr zerado automaticamente todos os dias a na hora q eu escolherei ,assim como o semanal dvera zera sozinho a cada tempo, q eu escolherei tmb, o total n ira zerar no automatico, somente manualmente

no comando d ver pontos,  quero poder ver os pontos do dia, da semana e do total

e no comando de zerar, quero poder zerar os pontos, de forma q zerando do dia, zere somente do dia, zerando semanal zerara da semana e do dia, e o total zera todos
