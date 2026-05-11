<header class="main-header">
  <div class="header-container">
    <div class="logo">
      <a href="index.php">
        <img src="resources/logo.png" alt="lumi logo"> </a>
    </div>

    <nav class="nav-menu">
      <ul>
        <?php
          // Hilfs-Logik: Welche Seite ist gerade aktiv?
          $currentPage = basename($_SERVER['PHP_SELF']);
        ?>
        <li><a href="ubersicht.php" class="<?php echo ($currentPage == 'ubersicht.php') ? 'active' : ''; ?>">Übersicht</a></li>
        <li><a href="kinder.php" class="<?php echo ($currentPage == 'kinder.php') ? 'active' : ''; ?>">Kinder</a></li>
        <li><a href="produkte.php" class="<?php echo ($currentPage == 'produkte.php') ? 'active' : ''; ?>">Produkte</a></li>
        <li><a href="empfehlungen.php" class="<?php echo ($currentPage == 'empfehlungen.php') ? 'active' : ''; ?>">Empfehlungen</a></li>
        <li><a href="mitteilungen.php" class="<?php echo ($currentPage == 'mitteilungen.php') ? 'active' : ''; ?>">Mitteilungen</a></li>
      </ul>
    </nav>

    <div class="user-actions">
      <button class="icon-btn">
        <span class="notification-dot"></span>
        <img src="resources/bell-icon.svg" alt="Notifications" style="width:20px;"> 
      </button>
      <div class="user-avatar">A</div>
    </div>
  </div>
</header>