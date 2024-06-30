const { getEloRatings, getTopEloRatings, resetElo, updateElo } = require('../services/eloService');

exports.getTopEloRatings = async (req, res) => {
    try {
        console.log('Fetching top ELO ratings...');
        const topEloRatings = await getTopEloRatings();
        console.log('Top ELO ratings fetched:', topEloRatings);
        res.json(topEloRatings);
    } catch (error) {
        console.error('Error fetching top ELO ratings:', error);
        res.status(500).json({ error: 'Failed to fetch top ELO ratings' });
    }
};

exports.getEloRatings = async (req, res) => {
    try {
        console.log('Fetching ELO ratings...');
        const eloRatings = await getEloRatings();
        console.log('ELO ratings fetched:', eloRatings);
        res.json(eloRatings);
    } catch (error) {
        console.error('Error fetching ELO ratings:', error);
        res.status(500).json({ error: 'Failed to fetch ELO ratings' });
    }
};

exports.resetEloScores = async (req, res) => {
    try {
        await resetElo();
        res.json({ message: 'ELO scores reset successfully' });
    } catch (error) {
        console.error('Error resetting ELO scores:', error);
        res.status(500).json({ error: 'Failed to reset ELO scores' });
    }
};

exports.updateElo = async (req, res) => {
    try {
        const { winnerId, loserId } = req.body;
        await updateElo(winnerId, loserId);
        res.json({ message: 'ELO updated successfully' });
    } catch (error) {
        console.error('Error updating ELO:', error);
        res.status(500).json({ error: 'Failed to update ELO' });
    }
};
