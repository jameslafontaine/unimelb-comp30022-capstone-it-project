-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8mb3 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`users` (
  `idusers` INT NOT NULL,
  `Name` VARCHAR(45) NOT NULL,
  `First_name` VARCHAR(45) NULL DEFAULT NULL,
  `Last_name` VARCHAR(45) NULL DEFAULT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `User_type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idusers`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`aap`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`aap` (
  `Supporting documentation` BLOB NOT NULL,
  `aapID` INT NOT NULL AUTO_INCREMENT,
  `idusers` INT NOT NULL,
  PRIMARY KEY (`aapID`),
  INDEX `fk_aap_users1_idx` (`idusers` ASC) VISIBLE,
  CONSTRAINT `fk_aap_users1`
    FOREIGN KEY (`idusers`)
    REFERENCES `mydb`.`users` (`idusers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`course (subject)`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`course (subject)` (
  `idCourse(subject)` INT NOT NULL,
  `Subject_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idCourse(subject)`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`assignments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`assignments` (
  `Assignment_type` VARCHAR(45) NOT NULL,
  `Assignment_weightage` INT NULL DEFAULT NULL,
  `Due_date` DATETIME NULL DEFAULT NULL,
  `Start_date` DATETIME NULL DEFAULT NULL,
  `AssignmentID` INT NOT NULL,
  `idCourse(subject)` INT NOT NULL,
  PRIMARY KEY (`AssignmentID`),
  INDEX `fk_assignments_course (subject)1_idx` (`idCourse(subject)` ASC) VISIBLE,
  CONSTRAINT `fk_assignments_course (subject)1`
    FOREIGN KEY (`idCourse(subject)`)
    REFERENCES `mydb`.`course (subject)` (`idCourse(subject)`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`case`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`case` (
  `Date_updated` DATE NOT NULL,
  `Date_created` DATE NOT NULL,
  `caseID` INT NOT NULL AUTO_INCREMENT,
  `users_idusers` INT NOT NULL,
  PRIMARY KEY (`caseID`, `users_idusers`),
  INDEX `fk_case_users1_idx` (`users_idusers` ASC) VISIBLE,
  CONSTRAINT `fk_case_users1`
    FOREIGN KEY (`users_idusers`)
    REFERENCES `mydb`.`users` (`idusers`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`course (subject)_has_users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`course (subject)_has_users` (
  `Course (subject)_idCourse (subject)` INT NOT NULL,
  `users_idusers` INT NOT NULL,
  PRIMARY KEY (`Course (subject)_idCourse (subject)`, `users_idusers`),
  INDEX `fk_Course (subject)_has_users_users1_idx` (`users_idusers` ASC) VISIBLE,
  INDEX `fk_Course (subject)_has_users_Course (subject)1_idx` (`Course (subject)_idCourse (subject)` ASC) VISIBLE,
  CONSTRAINT `fk_Course (subject)_has_users_Course (subject)1`
    FOREIGN KEY (`Course (subject)_idCourse (subject)`)
    REFERENCES `mydb`.`course (subject)` (`idCourse(subject)`),
  CONSTRAINT `fk_Course (subject)_has_users_users1`
    FOREIGN KEY (`users_idusers`)
    REFERENCES `mydb`.`users` (`idusers`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`thread`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`thread` (
  `ComplexCase` TINYINT NOT NULL,
  `threadID` INT NOT NULL AUTO_INCREMENT,
  `caseID` INT NOT NULL,
  PRIMARY KEY (`threadID`, `caseID`),
  INDEX `fk_thread_case1_idx` (`caseID` ASC) VISIBLE,
  CONSTRAINT `fk_thread_case1`
    FOREIGN KEY (`caseID`)
    REFERENCES `mydb`.`case` (`caseID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`extention request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`extention request` (
  `Proposed_due_date` DATE NOT NULL,
  `Supporting_document` BLOB NOT NULL,
  `Reasons_for_extentions` VARCHAR(45) NOT NULL,
  `Application_Status` VARCHAR(45) NOT NULL,
  `ExtentionID` INT NOT NULL AUTO_INCREMENT,
  `threadID` INT NOT NULL,
  PRIMARY KEY (`ExtentionID`, `threadID`),
  INDEX `fk_extention request_thread1_idx` (`threadID` ASC) VISIBLE,
  CONSTRAINT `fk_extention request_thread1`
    FOREIGN KEY (`threadID`)
    REFERENCES `mydb`.`thread` (`threadID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
