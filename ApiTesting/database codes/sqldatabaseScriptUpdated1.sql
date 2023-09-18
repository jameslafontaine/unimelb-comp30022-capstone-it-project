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
  `user_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `first_name` VARCHAR(45) NULL DEFAULT NULL,
  `last_name` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(45) NOT NULL,
  `user_type` VARCHAR(45) NOT NULL,
  `email_preference` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`aap`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`aap` (
  `Supporting documentation` BLOB NOT NULL,
  `aapID` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`aapID`),
  INDEX `fk_aap_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_aap_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`course (subject)`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`course (subject)` (
  `course_id(subject)` INT NOT NULL,
  `Subject_name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`course_id(subject)`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`assignments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`assignments` (
  `assignment_type` VARCHAR(45) NOT NULL,
  `assignment_weightage` INT NULL DEFAULT NULL,
  `due_date` DATETIME NULL DEFAULT NULL,
  `start_date` DATETIME NULL DEFAULT NULL,
  `assignment_id` INT NOT NULL,
  `course_id(subject)` INT NOT NULL,
  PRIMARY KEY (`assignment_id`),
  INDEX `fk_assignments_course (subject)1_idx` (`course_id(subject)` ASC) VISIBLE,
  CONSTRAINT `fk_assignments_course (subject)1`
    FOREIGN KEY (`course_id(subject)`)
    REFERENCES `mydb`.`course (subject)` (`course_id(subject)`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`case`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`case` (
  `Date_updated` DATE NOT NULL,
  `Date_created` DATE NOT NULL,
  `caseID` INT NOT NULL AUTO_INCREMENT,
  `users_user_id` INT NOT NULL,
  PRIMARY KEY (`caseID`, `users_user_id`),
  INDEX `fk_case_users1_idx` (`users_user_id` ASC) VISIBLE,
  CONSTRAINT `fk_case_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `mydb`.`users` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`course (subject)_has_users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`course (subject)_has_users` (
  `Course (subject)_course_id (subject)` INT NOT NULL,
  `users_user_id` INT NOT NULL,
  PRIMARY KEY (`Course (subject)_course_id (subject)`, `users_user_id`),
  INDEX `fk_Course (subject)_has_users_users1_idx` (`users_user_id` ASC) VISIBLE,
  INDEX `fk_Course (subject)_has_users_Course (subject)1_idx` (`Course (subject)_course_id (subject)` ASC) VISIBLE,
  CONSTRAINT `fk_Course (subject)_has_users_Course (subject)1`
    FOREIGN KEY (`Course (subject)_course_id (subject)`)
    REFERENCES `mydb`.`course (subject)` (`course_id(subject)`),
  CONSTRAINT `fk_Course (subject)_has_users_users1`
    FOREIGN KEY (`users_user_id`)
    REFERENCES `mydb`.`users` (`user_id`))
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
    REFERENCES `mydb`.`case` (`caseID`))
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
    REFERENCES `mydb`.`thread` (`threadID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `mydb`.`settings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`settings` (
  `settings_id` INT NOT NULL AUTO_INCREMENT,
  `extionsion_tutor` TINYINT NOT NULL DEFAULT 0,
  `extionsion_scoord` TINYINT NOT NULL DEFAULT 0,
  `general_tutor` TINYINT NOT NULL DEFAULT 0,
  `other_scoord` VARCHAR(45) NOT NULL DEFAULT 0,
  `general_scoord` TINYINT NOT NULL DEFAULT 0,
  `remark_tutor` TINYINT NOT NULL DEFAULT 0,
  `remark_scoord` TINYINT NOT NULL DEFAULT 0,
  `quiz_code_tutor` TINYINT NOT NULL DEFAULT 0,
  `quiz_code_scoord` TINYINT NOT NULL DEFAULT 0,
  `other_tutor` TINYINT NOT NULL DEFAULT 0,
  `extionsion_template` VARCHAR(1000) NULL,
  `general_template` VARCHAR(1000) NULL,
  `remark_template` VARCHAR(1000) NULL,
  `quiz_template` VARCHAR(1000) NULL,
  `other_template` VARCHAR(1000) NULL,
  `course_id` INT NOT NULL,
  PRIMARY KEY (`settings_id`, `course_id`),
  INDEX `fk_settings_course (subject)1_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_settings_course (subject)1`
    FOREIGN KEY (`course_id`)
    REFERENCES `mydb`.`course (subject)` (`course_id(subject)`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

SELECT * FROM assignments;
SELECT * FROM users;
SELECT * FROM settings;
SELECT * FROM `course (subject)`;